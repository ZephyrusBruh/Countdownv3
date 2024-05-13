let startDate, endDate;
let dateData;
const importantDatesDiv = document.getElementById("important-dates");
const importantMilestonesDiv = document.getElementById("important-milestones");
const importantTimesDiv = document.getElementById("important-times"); //For Zeph's class times cuase idk how I would do that :)
const explodesDiv = document.getElementById("wordYippee");
const ejectedDiv = document.getElementById("wordSus");


document.getElementById("showDaysOff").addEventListener("click", function(){
    importantMilestonesDiv.classList.add("hidden");
    importantDatesDiv.classList.remove("hidden");
});
document.getElementById("showMilestones").addEventListener("click", function(){
    importantMilestonesDiv.classList.remove("hidden");
    importantDatesDiv.classList.add("hidden");
});

document.getElementById("yippee").addEventListener("click", function(){
    explodesDiv.classList.remove("hidden");
    ejectedDiv.classList.add("hidden")
});
document.getElementById("sus").addEventListener("click", function(){
    ejectedDiv.classList.remove("hidden");
    explodesDiv.classList.add("hidden")
});


//Pulls dates from a cq
fetch("https://ects-cmp.com/files/calendar.json")
.then(resp => resp.json())
.then(data => {
        processDateFile(data);               
})
//Write start date and end date when you can think again

function processDateFile(data){
    dateData = data;
    //get the current date (it will be a date object)
    var today = new Date();
    var dd = String(today.getDate());
    var mm = String(today.getMonth() + 1);
    var yyyy = today.getFullYear();
    var todaystr = mm + '/' + dd + '/' + yyyy;                    
    //print out how many days from now until then
    endDate = data.endday;
    startDate = data.startday;

    //convert the enddate to a date object  
    //subtract all days listed as events after today from the weekdaysLeft 
    var weekdaysCount = getWeekdayCount();
    var daysOffCount = getDaysOffLeft();
    var weekdaysLeft = weekdaysCount - daysOffCount;
    document.getElementById("weekdaysLeft").innerHTML = weekdaysLeft;  
    var daysLeft = getDaysLeft();
    document.getElementById("daysLeft").innerHTML = daysLeft
    checkParams();

    dates(data.events, importantDatesDiv); /*KLINS - THIS NEEDS REPEATED FOR MILESTONES  (use data.milestones) - the method may need tweaked */ 
    dates(data.milestones, importantMilestonesDiv); //<-- Breaks it currently
}
function getDaysLeft(currentDate = new Date(), endDateObj = new Date(endDate)) {
    let count = 0;
    while (currentDate <= endDateObj) {
        
        const dayOfWeek = currentDate.getDay();
                count++;
        currentDate.setDate(currentDate.getDate() + 1);
    }   
    return count;
}
function getWeekdayCount(currentDate = new Date(), endDateObj = new Date(endDate)) {
    let count = 0;
    while (currentDate <= endDateObj) {
        
        const dayOfWeek = currentDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                count++;
            }
        currentDate.setDate(currentDate.getDate() + 1);
    }   
    return count;
}
function getDaysOffLeft(currentDate = new Date(), endDateObj = new Date(endDate)){
    let count = 0; //counts the number o' days off 

    for(let i = 0; i<dateData.events.length; i++){ 
        let foundFutureDates =false; 
        for(let j = 0; j<dateData.events[i].days.length; j++){
            let dayOffDate = new Date(dateData.events[i].days[j])
            if( dayOffDate> currentDate  && dayOffDate < endDateObj){
                if(dayOffDate <= endDateObj){
                    count ++;
                }
            }
        }
    }

    return count;
}

function dates(){
    importantDatesDiv.innerHTML = "";
    const currentDate = new Date();
    for(let i = 0; i<dateData.events.length; i++){ 
        let foundFutureDates =false;
        let eventName = dateData.events[i].event;
        let eventClass = getEventClass(eventName);
        let newDiv = `<div class="mini-container ${eventClass}">`;
        let allDaysUntil = getDaysLeft(new Date(), new Date(dateData.events[i].days[0]));
        let weekDaysUntil = getWeekdayCount(new Date(), new Date(dateData.events[i].days[0]));
        newDiv += `<p class="big">${eventName}</p><p class="smol">(${weekDaysUntil - getDaysOffLeft(currentDate, new Date(dateData.events[i].days[0]))} / ${allDaysUntil})</p><ul>`;

            for(let j = 0; j<dateData.events[i].days.length; j++){
            let dayOffDate = new Date(dateData.events[i].days[j])
            if( dayOffDate> currentDate ){
                foundFutureDates = true;
                newDiv +=
                 `                    
                    <li class="eventitem">  ${dateData.events[i].days[j]} </li>
                    
                `;
            }
        }
        if(foundFutureDates){
            newDiv += `</ul></div>`;
            importantDatesDiv.innerHTML += newDiv;
        }
    }
}

function milestones (){
    importantMilestonesDiv.innerHTML = "";
    const currentDate = new Date();
    for(let i = 0; i<dateData.milestones.length; i++){ 
        let foundFutureDates =false;
        let eventName = dateData.milestones[i].event;
        let eventClass = getEventClass(eventName);
        let newDiv = `<div class="mini-container ${eventClass}">`;
        let allDaysUntil = getDaysLeft(new Date(), new Date(dateData.milestones[i].day[0]));
        let weekDaysUntil = getWeekdayCount(new Date(), new Date(dateData.milestones[i].day[0]));
        newDiv += `<p class="big">${eventName}</p><p class="smol">(${weekDaysUntil - getDaysOffLeft()} / ${allDaysUntil})</p><ul>`;

            for(let j = 0; j<dateData.milestones[i].day.length; j++){
            let dayOffDate = new Date(dateData.milestones[i].day[j])
            if( dayOffDate> currentDate ){
                foundFutureDates = true;
                newDiv +=
                 `                    
                    <li class="eventitem">  ${dateData.milestones[i].day[j]} </li>
                
                `;
            }
        }
        if(foundFutureDates){
            newDiv += `</ul></div>`;
            importantmilestonesDiv.innerHTML += newDiv;
        }
    }
}

//the issue was that we are now passing in only the event data, so we don't need eventData.event[i], we just need eventData[i]
function dates(eventData,   targetDiv = importantDatesDiv){
    targetDiv.innerHTML = "";
    const currentDate = new Date();
    for(let i = 0; i<eventData.length; i++){ 
        let foundFutureDates =false;
        let eventName = eventData[i].event;
        let eventClass = getEventClass(eventName);
        let newDiv = `<div class="mini-container ${eventClass}">`;
        let allDaysUntil = getDaysLeft(new Date(), new Date(eventData[i].days[0]));
        let weekDaysUntil = getWeekdayCount(new Date(), new Date(eventData[i].days[0]));
        newDiv += `<p class="big">${eventName}</p><p class="smol">(${weekDaysUntil - getDaysOffLeft(currentDate, new Date(eventData[i].days[0]))} / ${allDaysUntil})</p><ul>`;

            for(let j = 0; j<eventData[i].days.length; j++){
            let dayOffDate = new Date(eventData[i].days[j])
            if( dayOffDate> currentDate ){
                foundFutureDates = true;
                console.log(eventData[i].days[j])
                newDiv +=
                 `                    
                    <li class="eventitem">  ${eventData[i].days[j]} <add-to-calendar-button
                    name="Title"
                    options="'Apple','Google','Outlook.com'"
                    location="World Wide Web"
                    startDate="${eventData[i].days[j]}"
                    endDate="${eventData[i].days[j]}"
                ></add-to-calendar-button></li>
                
                `;
            }
        }
        if(foundFutureDates){
            newDiv += `</ul></div>`;
            targetDiv.innerHTML += newDiv;
        }
    }
}

function getEventClass(eventName){
    switch(eventName.toUpperCase()){
        case "THANKSGIVING BREAK":
            return "fall";
        case"WINTER BREAK":
            return "winter";
        case "SPRING BREAK":
            return "spring";
        case "PRESIDENTS' DAY":
        case "MEMORIAL DAY":
            return "merica";
        case "END OF Q1":
        case "MIDDLE OF Q1":
            return "bronzemilestone";                    
        case "END OF Q2":
        case "MIDDLE OF Q2":
            return "bronzemilestone";
        case "END OF Q3":
        case "MIDDLE OF Q3":
            return "silvermilestone";
        case "END OF Q4":
        case "MIDDLE OF Q4":
            return "goldmilestone";    
        case "NOCTI WRITTEN PRE-TEST (JUNIORS)":
        case "NOCTI WRITTEN TEST (SENIORS)":
        case "NOCTI PERFORMANCE TEST (SENIORS)":
            return "nocti";
    }
}

function checkParams(){
    let params = new URLSearchParams(document.location.search);
    let showFile = params.get("showfileupload"); // is the string "Jonathan"
    if(showFile != undefined){
        document.getElementById("fileUpload").classList.remove("hidden");
    }
}