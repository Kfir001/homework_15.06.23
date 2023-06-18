// מחלקה שמייצגת סרט
class Movie {
  // בנאי המקבל את שם הסרט, הדירוג, קישור לתמונה וקישור לטריילר
  constructor(name, rating, image, trailer) {
    this.name = name;
    this.rating = rating;
    this.image = image;
    this.trailer = trailer;
  }
}

// מחלקה שמייצגת רשימת סרטים
class MovieList {
  // בנאי שיוצר מערך ריק של סרטים
  constructor() {
    this.movies = [];
  }

  // מתודה להוספת סרט לרשימה
  addMovie(name, rating, image, trailer) {
    // מוודא שהדירוג נמצא בטווח של 0 עד 5
    rating = Math.max(0, Math.min(5, rating));
    // משנה את הקישור לטריילר אם הוא מכיל "https://youtu.be/"
    if (trailer.includes("https://youtu.be/")) {
      trailer = trailer.replace(
        "https://youtu.be/",
        "https://www.youtube.com/embed/"
      );
    }
    // יוצר אובייקט חדש של סרט
    const movie = new Movie(name, rating, image, trailer);
    // מוסיף את האובייקט למערך של הסרטים
    this.movies.push(movie);
    // שומר את הרשימה ב- localStorage
    this.saveList();
  }

  // מתודה למחיקת סרט מהרשימה
  deleteMovie(name) {
    // מוצא את האינדקס של הסרט במערך
    const index = this.movies.findIndex((movie) => movie.name === name);
    // אם האינדקס לא -1 (משמע הסרט נמצא במערך)
    if (index !== -1) {
      // מוחק את האלמנט מהמערך
      this.movies.splice(index, 1);
      // שומר את הרשימה ב- localStorage
      this.saveList();
    }
  }

  // מתודה לשינוי הדירוג של סרט
  changeRating(name, change) {
    // מוצא את האינדקס של הסרט במערך
    const index = this.movies.findIndex((movie) => movie.name === name);
    // אם האינדקס לא -1 (משמע הסרט נמצא במערך)
    if (index !== -1) {
      // משנה את הדירוג של הסרט להיות בין 0 ל-5
      this.movies[index].rating = Math.max(
        0,
        Math.min(5, this.movies[index].rating + change)
      );
      // שומר את הרשימה ב- localStorage
      this.saveList();
    }
  }

  // מתודה לשמירת הרשימה ב- localStorage
  saveList() {
    localStorage.setItem("movies", JSON.stringify(this.movies));
  }

  // מתודה לשיתוף הרשימה ב- WhatsApp
  shareList() {
    // יוצר הודעה עם פרטי הסרטים
    let message = "My Favorite Movies:\n";
    for (const movie of this.movies) {
      message += `${movie.name} - Rating: ${movie.rating}\nImage: ${movie.image}\nTrailer: ${movie.trailer}\n`;
    }
    // יוצר קישור לשיתוף ההודעה ב- WhatsApp
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    // פותח את הקישור בחלון חדש
    window.open(url);
    // מוחק את הרשימה מ- localStorage
    localStorage.removeItem("movies");
  }

  // מתודה לטעינת הרשימה מ- localStorage
  loadList() {
    // קורא את הנתונים מ- localStorage
    const savedMovies = JSON.parse(localStorage.getItem("movies"));
    // אם יש נתונים שמורים
    if (savedMovies) {
      // מעבר על כל הנתונים והוספתם למערך של הסרטים
      for (const movie of savedMovies) {
        this.addMovie(movie.name, movie.rating, movie.image, movie.trailer);
      }
      // מעדכן את הדף להציג את הנתונים
      this.renderMovies();
    }
  }
  // מתודה לעדכון הדף והצגת הנתונים
  renderMovies() {
    // מוצא את האלמנט של רשימת הסרטים
    const movieList = document.querySelector("#movie-list");
    // מנקה את התוכן של האלמנט
    movieList.innerHTML = "";
    // מעבר על כל הסרטים במערך
    for (const movie of this.movies) {
      // יוצר אלמנט li חדש לכל סרט
      const movieItem = document.createElement("li");
      // מוסיף לו class של "movie-item"
      movieItem.classList.add("movie-item");

      // יוצר אלמנט div להצגת מידע על הסרט
      const movieInfo = document.createElement("div");
      // יוצר מחרוזת של כוכביות להצגת הדירוג
      const stars = "★".repeat(movie.rating) + "☆".repeat(5 - movie.rating);
      // מעדכן את ה- innerHTML של האלמנט להציג את שם הסרט ואת הדירוג
      movieInfo.innerHTML = `<h3>${movie.name}</h3><p>Rating: <span>${stars}</span></p>`;

      // יוצר אלמנט button להפעלת הטריילר
      const trailerButton = document.createElement("button");
      // מוסיף לו class של "styled-button"
      trailerButton.classList.add("styled-button");
      // מעדכן את ה- innerText שלו ל- "Watch Trailer"
      trailerButton.innerText = "Watch Trailer";
      // מוסיף event listener ל- click
      trailerButton.addEventListener("click", () => {
        // מוצא את האלמנטים של ה- modal ושל ה- player
        const trailerModal = document.querySelector("#trailer-modal");
        const trailerPlayer = document.querySelector("#trailer-player");
        // שומר את קישור הטריילר במשתנה
        let trailerUrl = movie.trailer;
        // אם הקישור מכיל "youtube.com/watch?v="
        if (trailerUrl.includes("youtube.com/watch?v=")) {
          // משנה את ה- "watch?v=" ל- "embed/"
          trailerUrl = trailerUrl.replace("watch?v=", "embed/");
        }
        // הגדרת משתנה לאלמנט של נגן הטריילר
        trailerPlayer.innerHTML = `<iframe width="300" height="200" src="${trailerUrl}" frameborder="0" allowfullscreen></iframe>`;
        // הצגת המודל של נגן הטריילר
        trailerModal.style.display = "block";
      });

      // יצירת אלמנט תמונה לסרט
      const movieImage = document.createElement("img");
      // הגדרת מקור התמונה
      movieImage.src = movie.image;

      // יצירת כפתור מחיקה
      const deleteButton = document.createElement("button");
      // הוספת מחלקה לכפתור
      deleteButton.classList.add("styled-button");
      // הוספת טקסט לכפתור
      deleteButton.innerText = "Delete";
      // הוספת אירוע לחיצה לכפתור
      deleteButton.addEventListener("click", () => {
        // מחיקת הסרט מהרשימה
        this.deleteMovie(movie.name);
        // רענון תצוגת הרשימה
        this.renderMovies();
      });

      // יצירת כפתור העלאת דירוג
      const upButton = document.createElement("button");
      // הוספת מחלקה לכפתור
      upButton.classList.add("styled-button");
      // הוספת טקסט לכפתור
      upButton.innerText = "👍🏼";
      // הוספת אירוע לחיצה לכפתור
      upButton.addEventListener("click", () => {
        // שינוי דירוג הסרט
        this.changeRating(movie.name, 1);
        // רענון תצוגת הרשימה
        this.renderMovies();
      });

      // יצירת כפתור הורדת דירוג
      const downButton = document.createElement("button");
      // הוספת מחלקה לכפתור
      downButton.classList.add("styled-button");
      // הוספת טקסט לכפתור
      downButton.innerText = "👎🏼";
      // הוספת אירוע לחיצה לכפתור
      downButton.addEventListener("click", () => {
        // שינוי דירוג הסרט
        this.changeRating(movie.name, -1);
        // רענון תצוגת הרשימה
        this.renderMovies();
      });

      // הוספת אלמנטים לאלמנט של פריט הרשימה
      movieItem.appendChild(movieInfo);
      movieItem.appendChild(movieImage);
      movieItem.appendChild(trailerButton);
      movieItem.appendChild(deleteButton);
      movieItem.appendChild(upButton);
      movieItem.appendChild(downButton);

      // הוספת אלמנט של פריט הרשימה לרשימה
      movieList.appendChild(movieItem);
    }
    // הגדרת משתנה לאלמנט של המודל של נגן הטריילר
    this.trailerModal = document.querySelector("#trailer-modal");
    // הגדרת משתנה לאלמנט של כפתור הסגירה
    this.closeButton = document.querySelector(".close");

    // הוספת אירוע לחיצה לכפתור הסגירה
    this.closeButton.onclick = () => {
      // הסתרת המודל של נגן הטריילר
      this.trailerModal.style.display = "none";
    };

    // הוספת אירוע לחיצה לחלון
    window.onclick = (event) => {
      // בדיקה אם האלמנט שנלחץ הוא המודל של נגן הטריילר
      if (event.target == this.trailerModal) {
        // הסתרת המודל של נגן הטריילר
        this.trailerModal.style.display = "none";
      }
    };
  }
}

// הוספת מאזין אירוע לחיצה לאלמנט של כפתור הוספת סרט
document.querySelector("#add-movie").addEventListener("click", () => {
  // מציא את האלמנטים של טופס הסרט וכפתור שיתוף הרשימה
  const movieForm = document.querySelector("#movie-form");
  const shareList = document.querySelector("#share-list");
  // בודק אם טופס הסרט מוצג כעת
  if (movieForm.classList.contains("visible")) {
    // אם כן, מסתיר אותו
    movieForm.classList.remove("visible");
    // ממתין לסיום המעבר לפני שמגדיר את התצוגה כלא נראה
    setTimeout(() => {
      movieForm.style.display = "none";
    }, 2000);
    // מראה את כפתור שיתוף הרשימה
    shareList.classList.remove("hidden");
  } else {
    // אם לא, מראה אותו
    movieForm.style.display = "flex";
    // ממתין להבא של השקוף לפני שמוסיף את המחלקה הנראית
    requestAnimationFrame(() => {
      movieForm.classList.add("visible");
    });
    // מסתיר את כפתור שיתוף הרשימה
    shareList.classList.add("hidden");
  }
});

// הוספת אירוע לחיצה לאלמנט של כפתור שליחת הטופס
document.querySelector("#submit-movie").addEventListener("click", () => {
  // הגדרת משתנים לאלמנטים של השדות בטופס
  const nameInput = document.querySelector("#movie-name");
  const ratingInput = document.querySelector("#movie-rating");
  const imageInput = document.querySelector("#movie-image");
  const trailerInput = document.querySelector("#movie-trailer");

  // המרת ערך הדירוג למספר
  const rating = parseInt(ratingInput.value);
  // בדיקה אם הדירוג תקין
  if (rating >= 1 && rating <= 5) {
    // הוספת הסרט לרשימה
    movieList.addMovie(
      nameInput.value,
      rating,
      imageInput.value,
      trailerInput.value
    );

    // איפוס ערכי השדות בטופס
    nameInput.value = "";
    ratingInput.value = "";
    imageInput.value = "";
    trailerInput.value = "";

    // רענון תצוגת הרשימה
    movieList.renderMovies();
  } else {
    // הצגת הודעה למשתמש במידה והדירוג אינו תקין
    alert("Please enter a valid rating between 1 and 5");
  }
});

// הוספת אירוע לחיצה לאלמנט של כפתור שיתוף הרשימה
document.querySelector("#share-list").addEventListener("click", () => {
  // שיתוף הרשימה
  movieList.shareList();
});

// בעת טעינת הדף
window.onload = () => {
  // הצגת הודעת ברוך הבא למשתמש
  const message = alert(
    "ברוכים הבאים ל Fullstack +,\nכדי ליצור רשימת סרטים בצעו את השלבים הבאים:\n1. רשמו את שם הסרט\n2. דרגו את הסרט מ 1 עד 5 (לא יתאפשר ציון גבוה יותר)\n3. הכניסו קישור לתמונה\n4. הכניסו קישור לטריילר\n5. שתפו את הרשימה ב whatsapp\n6. תהנו"
  );
};

// יצירת מופע חדש של רשימת סרטים
const movieList = new MovieList();

// בעת טעינת הדף
window.onload = () => {
  // טעינת הרשימה
  movieList.loadList();
};
