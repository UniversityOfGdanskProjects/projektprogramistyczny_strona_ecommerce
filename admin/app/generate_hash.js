import bcrypt from "bcryptjs";

const password = "haslo";

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error("Błąd przy szyfrowaniu hasła:", err);
  } else {
    console.log("Zaszyfrowane hasło:", hash);
  }
});
