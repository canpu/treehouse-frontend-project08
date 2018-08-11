/* Declarations and Settings */
const numOfUsers = 12;
const nationality = "us";
const $mainRegion = $("main");
const cards = document.getElementsByClassName("user__card");
const $overlay = $(".overlay");
const $modal = $(".modal");
const $closeBtn = $(".button__close");
const $previousBtn = $(".button__previous");
const $nextBtn = $(".button__next");
const $searchbox = $(".searchbox");
const stateAbbrev = [
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arizona', 'AZ'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ].map(state => [state[0].toLowerCase(), state[1]])
     .reduce((states, state) => states.set(state[0], state[1]), new Map());
const animationTimeShort = 150;
const animationTimeLong = 300;
var users;
var currentIndex; // the index of user currently shown in the modal

/* Information Display Function on Main Screen */
function displayUsers(usersData) {
  usersData.forEach(user => {
    let $card = $('<div class="user__card"></div>');
    $card.appendTo($mainRegion);
    $card.append(`<img class='user__image' src=${user.picture.large} />`);
    $card.append(`<h2 class='user__name'>${user.name.first} ${user.name.last}</h2>`);
    $card.append(`<p class='user__email'>${user.email}</p>`);
    $card.append(`<p class='user__city'>${user.location.city}</p>`);
  });
}

/* Information Display Function on Overlay */
function displayUserDetails(index) {
  let user = users[index];
  $(".modal .user__image").attr("src", user.picture.large);
  $(".modal .user__name").text(user.name.first + " " + user.name.last);
  $(".modal .user__email").text(user.email);
  $(".modal .user__city").text(user.location.city);
  $(".modal .user__phone").text(user.phone);
  $(".modal .user__address").text(user.location.street + ", " + user.location.city + ", " + stateAbbrev.get(user.location.state) + " " + user.location.postcode);
  $(".modal .user__dob").text("Birthday: " + user.dob.date.substring(5, 7) + "/" + user.dob.date.substring(8, 10) + "/" + user.dob.date.substring(0, 4));
}

/* User Info Retrieval from Random User Generator */
$.ajax({
  url: `https://randomuser.me/api/?results=${numOfUsers}&nat=${nationality}`,
  dataType: 'json',
  success: function(data) {
    users = data.results;
    displayUsers(users);
  }
});

/* User Selection */
$mainRegion.click(function (event) {
  let $target = $(event.target);
  let $card = $target.hasClass("user__card") ? $target[0] : $target.parents(".user__card")[0];
  if ($card != null) {
    $overlay.show(animationTimeShort);
    $card = $target.hasClass("user__card") ? $target : $target.parents(".user__card");
    currentIndex = $card.index();
  }
  displayUserDetails(currentIndex);
});

/* Close Button */
$closeBtn.click(function (event) {
  $overlay.hide(animationTimeShort);
});

/* Left and Right Buttons */
function displayPrevious () {
  if ($overlay.css("visibility") == "visible" && !$modal.is(":animated")) {
    currentIndex--;
    if (currentIndex < 0)
      currentIndex += numOfUsers;
    window.setTimeout(() => displayUserDetails(currentIndex), animationTimeLong);
    $modal.fadeOut(animationTimeLong).fadeIn(animationTimeLong);
  }
}

function displayNext () {
  if ($overlay.css("visibility") == "visible" && !$modal.is(":animated")) {
    currentIndex++;
    currentIndex %= numOfUsers;
    window.setTimeout(() => displayUserDetails(currentIndex), animationTimeLong);
    $modal.fadeOut(animationTimeLong).fadeIn(animationTimeLong);
  }
}

$previousBtn.click(event => {
  displayPrevious();
});

$nextBtn.click(event => {
  displayNext();
});

/* Keyboard Control */
$("body").keyup(event => {
  if (event.which == 27)
    $overlay.hide(animationTimeShort);
  else if (event.which == 37 || event.which == 38)
    displayPrevious();
  else if (event.which == 39 || event.which == 40)
    displayNext();
});


/* Searchbox Filtering */
$searchbox.on("input", event => {
  let name = $searchbox.val().toLowerCase();
  if (name.length > 0) {
    for (let index = 0; index < numOfUsers; index++) {
      let card = cards[index];
      let $user = $(card.getElementsByTagName("h2")[0]);
      if ($user.text().toLowerCase().indexOf(name) != -1)
        $(card).show(animationTimeShort);
      else
        $(card).hide(animationTimeShort);
    }
  } else
    for (let index = 0; index < numOfUsers; index++) {
      let card = cards[index];
      $(card).show(animationTimeShort);
    };
});
