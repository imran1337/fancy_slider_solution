const imagesArea = document.querySelector(".images");
const gallery = document.querySelector(".gallery");
const galleryHeader = document.querySelector(".gallery-header");
const searchBtn = document.getElementById("search-btn");
const sliderBtn = document.getElementById("create-slider");
const sliderContainer = document.getElementById("sliders");
// selected image
let sliders = [];

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = "15674931-a9d714b6e9d654524df198e00&q";

// show images
const showImages = (images) => {
  console.log(images);
  if (images.length > 0) {
    imagesArea.style.display = "block";
    gallery.innerHTML = "";
    // show gallery title
    galleryHeader.style.display = "flex";
    images.forEach((image) => {
      let div = document.createElement("div");
      div.className = "col-lg-3 col-md-4 col-xs-6 img-item mb-2";
      div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div);
      //hide error msg
      document.getElementById("spinner").classList.add("d-none");
      document.getElementById("err_show").classList.add("d-none");
    });
  } else {
    console.log("data not found");
    // hide image aria
    imagesArea.style.display = "none";
    //show error msg
    document.getElementById("err_show").classList.remove("d-none");
  }
};

// local storage items function
function showStoredImage() {
  const img = localStorage.getItem("images");
  const storedImg = JSON.parse(img);
  showImages(storedImg);
}

//local storage data show
if (localStorage.getItem("images") && localStorage.getItem("images") !== []) {
  showStoredImage();
}

const getImages = (query) => {
  fetch(
    `https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`
  )
    .then((response) => response.json())
    .then((data) => {
      showImages(data.hits);
      //store image
      localStorage.setItem("images", JSON.stringify(data.hits));
    })
    .catch((err) => console.log(err));
};

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle("added");

  //slide img select toggle
  sliders.indexOf(img) === -1
    ? sliders.push(img)
    : (sliders = sliders.filter((slide) => slide !== img));
};
let timer;
const createSlider = () => {
  const duration = document.getElementById("duration").value || 1000;
  
  if (duration < 0) {
    alert("Invalid Value");
  } else {
    // check slider image length
    if (sliders.length < 2) {
      alert("Select at least 2 image.");
      console.log("duration", duration);
      return;
    }

    // crate slider previous next area
    sliderContainer.innerHTML = "";
    const prevNext = document.createElement("div");
    prevNext.className =
      "prev-next d-flex w-100 justify-content-between align-items-center";
    prevNext.innerHTML = ` 
<span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
<span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
`;

    sliderContainer.appendChild(prevNext);
    document.querySelector(".main").style.display = "block";
    // hide image aria
    imagesArea.style.display = "none";

    sliders.forEach((slide) => {
      let item = document.createElement("div");
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100"
  src="${slide}"
  alt="">`;
      sliderContainer.appendChild(item);
    });
    changeSlide(0);
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
      console.log(duration);
    }, duration);
  }
};
// change slider index
const changeItem = (index) => {
  changeSlide((slideIndex += index));
};

// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll(".slider-item");
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  }

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach((item) => {
    item.style.display = "none";
  });

  items[index].style.display = "block";
};

searchBtn.addEventListener("click", function () {
  const searchInput = document.getElementById("search");
  if (searchInput.value.length > 0 && searchInput.value !== " ") {
    document.querySelector(".main").style.display = "none";
    clearInterval(timer);
    const search = document.getElementById("search");
    getImages(search.value);
    sliders.length = 0;
    spinnerHandler();
  } else {
    alert("please type something");
  }
});

sliderBtn.addEventListener("click", function () {
  createSlider();
  if (sliders.length >= 2 && duration.value >= 0) {
    searchAndBackBtnToggle();
  }
});

function searchAndBackBtnToggle() {
  document.getElementById("back_btn").classList.toggle("d-block");
  document.getElementById("search_section").classList.toggle("d-none");
}

//back go home
document.getElementById("back_btn").addEventListener("click", () => {
  searchAndBackBtnToggle();
  imagesArea.style.display = "block";
  document.querySelector(".main").style.display = "none";
  document
    .querySelectorAll(".added")
    .forEach((e) => e.classList.remove("added"));
  sliders.length = 0;
  clearInterval(timer);
});

//enter search btn click
search.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchBtn.click();
  }
});

// enter Slider btn click
duration.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sliderBtn.click();
  }
});

//spinner
function spinnerHandler() {
  document.getElementById("spinner").classList.remove("d-none");
  gallery.innerHTML = "";
  galleryHeader.style.display = "none";
}
