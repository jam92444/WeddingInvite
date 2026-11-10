(() => {
  "use strict";

  const config = window.INVITATION_CONFIG;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const safeText = (element, value) => {
    element.textContent = value ?? "";
  };

  document.documentElement.classList.add("js");

  const event = config.event;
  const eventDate = new Date(`${event.dateISO}T${event.time24}:00`);
  const eventEnd = new Date(eventDate.getTime() + 3 * 60 * 60 * 1000);

  /* Cover and opening media */
  const cover = $("#cover");
  const main = $("#main");
  const openButton = $("#openButton");
  const coverMedia = $("#coverMedia");
  const video = $("#openingVideo");
  const skipButton = $("#skipVideo");

  const revealInvitation = () => {
    cover.setAttribute("hidden", "");
    main.removeAttribute("hidden");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  openButton.addEventListener("click", () => {
    const videoPath = config.media.openingVideo;

    if (!videoPath) {
      revealInvitation();
      return;
    }

    video.src = videoPath;
    coverMedia.hidden = false;
    openButton.setAttribute("aria-expanded", "true");

    video.addEventListener("ended", revealInvitation, { once: true });
    video.addEventListener("error", () => {
      coverMedia.hidden = true;
      revealInvitation();
    }, { once: true });

    video.play().catch(() => {
      coverMedia.hidden = true;
      revealInvitation();
    });
  });

  skipButton.addEventListener("click", () => {
    video.pause();
    revealInvitation();
  });

  /* Optional music: starts only after an explicit guest action */
  let music = null;

  if (config.media.music) {
    openButton.addEventListener("click", () => {
      if (music) return;

      music = new Audio(config.media.music);
      music.loop = true;
      music.volume = 0.45;

      music.play().catch(() => {
        music = null;
      });
    }, { once: true });
  }

  /* Letter */
  safeText($("#letterGreeting"), config.letter.greeting);

  const letterBody = $("#letterBody");
  letterBody.replaceChildren();

  config.letter.body.forEach((paragraph) => {
    const p = document.createElement("p");
    safeText(p, paragraph);
    letterBody.append(p);
  });

  safeText($("#letterSignature"), config.letter.signature);

  /* Calendar */
  const year = eventDate.getFullYear();
  const month = eventDate.getMonth();
  const monthName = eventDate.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: event.timeZone
  });

  safeText($("#calendarMonth"), monthName);

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const eventDay = eventDate.getDate();
  const tbody = $("#calendarBody");

  let row = document.createElement("tr");

  for (let i = 0; i < firstWeekday; i += 1) {
    const cell = document.createElement("td");
    cell.className = "empty";
    row.append(cell);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    if (row.children.length === 7) {
      tbody.append(row);
      row = document.createElement("tr");
    }

    const cell = document.createElement("td");
    safeText(cell, String(day));

    if (day === eventDay) {
      cell.className = "event";
      cell.setAttribute("aria-current", "date");
      cell.setAttribute("aria-label", `Event day: ${day} ${monthName}`);
    }

    row.append(cell);
  }

  while (row.children.length < 7) {
    const cell = document.createElement("td");
    cell.className = "empty";
    row.append(cell);
  }

  tbody.append(row);

  /* ICS calendar invitation */
  const formatICSDate = (date) => {
    const pad = (value) => String(value).padStart(2, "0");
    return [
      date.getFullYear(),
      pad(date.getMonth() + 1),
      pad(date.getDate())
    ].join("") + "T" + [
      pad(date.getHours()),
      pad(date.getMinutes()),
      pad(date.getSeconds())
    ].join("");
  };

  const escapeICS = (value) => String(value)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Falak and Asif Nikah//Invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VTIMEZONE",
    `TZID:${event.timeZone}`,
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZOFFSETFROM:+0530",
    "TZOFFSETTO:+0530",
    "TZNAME:IST",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:falak-asif-nikah-${event.dateISO}@invitation.local`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART;TZID=${event.timeZone}:${formatICSDate(eventDate)}`,
    `DTEND;TZID=${event.timeZone}:${formatICSDate(eventEnd)}`,
    `SUMMARY:${escapeICS(`${event.coupleLine} — Nikah`)}`,
    `DESCRIPTION:${escapeICS(
      `Nikah of ${event.bride.name} and ${event.groom.name}. ` +
      `${event.timeDisplay}. Hosted by ${event.host}.`
    )}`,
    `LOCATION:${escapeICS(`${config.venue.name}, ${config.venue.address}`)}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  $("#addToCalendar").href = URL.createObjectURL(
    new Blob([ics], { type: "text/calendar;charset=utf-8" })
  );

  /* Countdown */
  const countdown = $("#countdown");
  const status = $("#eventStatus");
  const pad = (value) => String(value).padStart(2, "0");

  const renderCountdown = () => {
    const difference = eventDate.getTime() - Date.now();

    if (difference <= 0) {
      countdown.hidden = true;
      status.hidden = false;

      safeText(
        status,
        difference > -24 * 60 * 60 * 1000
          ? "Today we celebrate the Nikah of Falak and Asif."
          : "The Nikah has taken place. Thank you for your prayers and blessings."
      );

      return;
    }

    const totalMinutes = Math.floor(difference / 60000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;

    safeText($("#cdDays"), String(days));
    safeText($("#cdHours"), pad(hours));
    safeText($("#cdMinutes"), pad(minutes));
  };

  renderCountdown();
  setInterval(renderCountdown, 30000);

  /* Schedule */
  const schedule = config.schedule;

  if (schedule.enabled && schedule.items.length) {
    const section = $("#schedule");
    const list = $("#scheduleList");

    section.hidden = false;
    safeText($("#schedule-title"), schedule.title);

    schedule.items.forEach((item) => {
      const li = document.createElement("li");
      li.className = "timeline__item";

      const time = document.createElement("p");
      time.className = "timeline__time";
      safeText(time, item.time);

      const title = document.createElement("h3");
      title.className = "timeline__title";
      safeText(title, item.title);

      const description = document.createElement("p");
      description.className = "timeline__description";
      safeText(description, item.description);

      li.append(time, title, description);
      list.append(li);
    });
  }

  /* Venue */
  const venue = config.venue;

  if (venue.enabled) {
    const section = $("#venue");

    section.hidden = false;
    safeText($("#venue-title"), venue.name);
    safeText($("#venueAddress"), venue.address);
    safeText($("#venueAdditional"), venue.additional);

    const mapLink = $("#venueMapLink");
    mapLink.href = venue.mapLink;
    mapLink.setAttribute("aria-label", `Open map for ${venue.name}`);
  }

  /* Closing */
  safeText($("#closingText"), config.closing.signOff);
  safeText($("#closingDate"), config.closing.repeatDate);

  const contacts = $("#closingContacts");
  contacts.replaceChildren();

  event.contactNumbers.forEach((number, index) => {
    if (index) contacts.append(document.createTextNode(" · "));

    const link = document.createElement("a");
    link.href = `tel:${number.replace(/\s+/g, "")}`;
    safeText(link, number);
    contacts.append(link);
  });

  /* One-time reveals */
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!reducedMotion.matches && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

    $$(".reveal").forEach((element) => observer.observe(element));
  } else {
    $$(".reveal").forEach((element) => element.classList.add("is-visible"));
  }
})();
