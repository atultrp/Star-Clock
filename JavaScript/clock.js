function renderClock({ clockContainer, data, error }) {
    if (error) {
        clockContainer.innerHTML = `<p class="error">${error}</p>`;
        return;
    }
    const icon = data.isDayTime ? 'sun' : 'moon';
    clockContainer.innerHTML = `
    <div class="greeting">
      <img src="assets/desktop/icon-${icon}.svg" 
        width="24" 
        height="24" 
        alt="icon ${icon}" 
        id="day-night-icon">
      <span class="less-big">${data.greeting}</span>
      <span class="less-big currently">, it's currently</span>
    </div>
    <div class="time">
      <h1 id="time" class="huge">${data.time}</h1>
      <span class="timezone">${data.tzOffset}</span>
    </div>
    <div class="location"> 
      <span class="big">in ${data.location}</span>
    </div>
    `;
}

function clock({
    clockContainer,
    timeZoneElement
}) {
    const timeApiUrl = "https://timezoneapi.io/api/ip/?token=aGBpamkOwzjCMkOpRmzb";

    function getGreeting(hours) {
        if (hours >= 5 && hours <= 11) return "Good morning";
        else if (hours >= 12 && hours <= 17) return "Good afternoon";
        else return "Good evening";
    }

    let randImgNum = Math.floor(Math.random() * 2)+1;

    function setTheme(isDayTime) {
        const image = isDayTime ? `day${randImgNum}time` : `night${randImgNum}time`;
        const version = window.matchMedia('(max-width: 600px)').matches ? "mobile" : "desktop";
        const body = document.getElementsByTagName("body")[0];
        body.style.background = `url(assets/${version}/bg-image-${image}.jpg) no-repeat  center fixed`;
        body.style.height = `100%`;
        body.style.backgroundSize = `cover`;
        if (!isDayTime) document.getElementsByTagName("aside")[0].classList.add("dark");
    }

    const formatHoursAndMinutes = (hours, minutes) =>
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

    async function fetchTimeAndLocation() {
        const response = await fetch(timeApiUrl);
        if (!response.ok) throw new Error('Could not fetch the time');
        const { data } = await response.json();
        console.log(data)
        const date = new Date(data.datetime.date_time);
        const hours = date.getHours();
        return {
            timeZone: data.timezone.id,
            time: formatHoursAndMinutes(hours, date.getMinutes()),
            tzOffset: data.datetime.offset_tzab,
            greeting: getGreeting(hours),
            isDayTime: hours >= 5 && hours <= 17,
            location: `${data.city}, ${data.country}`
        };
    }
    fetchTimeAndLocation()
        .then((data) => {
            setTheme(data.isDayTime);
            renderClock({ clockContainer, data });
            timeZoneElement.textContent = data.timeZone;
        })
        .catch(error => renderClock({ clockContainer, error }));

    window.setInterval(() => {
        const now = new Date();
        const timeElt = document.getElementById("time");
        if (timeElt)
            timeElt.innerText = formatHoursAndMinutes(now.getHours(), now.getMinutes());
    }, 1000);
}

clock({
    clockContainer: document.querySelector("div.clock"),
    timeZoneElement: document.getElementById("time-zone")
});