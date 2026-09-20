const body = document.body;
const opening = document.querySelector("#opening");
const openButton = document.querySelector("#openInvitation");

if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo({ top: 0, left: 0, behavior: "auto" });

function openInvitation() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  opening.classList.add("is-opened");
  body.classList.remove("is-locked");
  window.setTimeout(() => opening.setAttribute("hidden", ""), 950);
}

openButton.addEventListener("click", openInvitation);
opening.addEventListener("click", (event) => {
  if (event.target === opening || event.target.classList.contains("opening__veil")) {
    openInvitation();
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

function renderCalendar() {
  const target = document.querySelector("#calendarDays");
  const year = 2032;
  const month = 6;
  const firstDay = new Date(year, month, 1).getDay();
  const mondayOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let index = 0; index < mondayOffset; index += 1) {
    const blank = document.createElement("span");
    blank.setAttribute("aria-hidden", "true");
    target.append(blank);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const cell = document.createElement("span");
    cell.textContent = day;
    if (day === 7) {
      cell.classList.add("is-wedding");
      cell.setAttribute("aria-label", "7 июля — день свадьбы");
    }
    target.append(cell);
  }
}

renderCalendar();

const targetDate = new Date("2032-07-07T00:00:00+03:00").getTime();

function updateTimer() {
  const distance = Math.max(0, targetDate - Date.now());
  const days = Math.floor(distance / 86400000);
  const hours = Math.floor((distance % 86400000) / 3600000);
  const minutes = Math.floor((distance % 3600000) / 60000);
  const seconds = Math.floor((distance % 60000) / 1000);

  document.querySelector("#days").textContent = String(days).padStart(4, "0");
  document.querySelector("#hours").textContent = String(hours).padStart(2, "0");
  document.querySelector("#minutes").textContent = String(minutes).padStart(2, "0");
  document.querySelector("#seconds").textContent = String(seconds).padStart(2, "0");
}

updateTimer();
window.setInterval(updateTimer, 1000);

const form = document.querySelector("#rsvpForm");
const formStatus = document.querySelector("#formStatus");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const formData = new FormData(form);
  const labels = {
    yes: "С удовольствием приду",
    no: "К сожалению, не смогу",
    self: "Самостоятельно",
    transfer: "Понадобится трансфер",
    sparkling: "Игристое",
    "white-wine": "Белое вино",
    "red-wine": "Красное вино",
    strong: "Крепкие напитки",
    soft: "Безалкогольные напитки",
  };
  const drinkValues = formData.getAll("drinks");
  const drinks = drinkValues.length
    ? drinkValues.map((value) => labels[value] ?? value).join(", ")
    : "Не указано";
  const message = [
    "Ответ на свадебное приглашение Тимура и Анны 💍",
    "",
    `Имя: ${formData.get("name")}`,
    `Присутствие: ${labels[formData.get("attendance")]}`,
    `Как доберусь: ${labels[formData.get("transport")]}`,
    `Алкоголь: ${formData.get("alcohol") === "yes" ? "Да" : "Нет"}`,
    `Предпочтения: ${drinks}`,
  ].join("\n");

  const whatsappUrl = `https://wa.me/79604588898?text=${encodeURIComponent(message)}`;
  formStatus.textContent = "Открываем WhatsApp. Проверьте сообщение и нажмите «Отправить».";
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});
