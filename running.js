let startDate, endDate;
let dateData;
const importantDatesDiv = document.getElementById("important-dates");
const importantMilestonesDiv = document.getElementById("important-milestones");
const importateDutiesDiv = document.getElementById("important-duties");
const calendarDiv = document.getElementById("calendar"); //Stealing this for myself now.
const explodesDiv = document.getElementById("wordYippee");
const ejectedDiv = document.getElementById("wordSus");
// bruh
var pastDates = document.getElementById("showPastDates");
var scam = 0;

document.getElementById("showCalendar").disabled=true;

document.getElementById("showDaysOff").addEventListener("click", function(){
    importantDatesDiv.classList.remove("hidden");
    importantMilestonesDiv.classList.add("hidden");
    importateDutiesDiv.classList.add("hidden");
    calendarDiv.classList.add("hidden");
});
document.getElementById("showMilestones").addEventListener("click", function(){
    importantDatesDiv.classList.add("hidden");
    importantMilestonesDiv.classList.remove("hidden");
    importateDutiesDiv.classList.add("hidden");
    calendarDiv.classList.add("hidden");
});
document.getElementById("showteacherduites").addEventListener("click", function(){
    importantDatesDiv.classList.add("hidden");
    importantMilestonesDiv.classList.add("hidden");
    importateDutiesDiv.classList.remove("hidden");
    calendarDiv.classList.add("hidden");
});
document.getElementById("showCalendar").addEventListener("click", function(){
    importantDatesDiv.classList.add("hidden");
    importantMilestonesDiv.classList.add("hidden");
    importateDutiesDiv.classList.add("hidden");
    calendarDiv.classList.remove("hidden");
});
document.getElementById("yippee").addEventListener("click", function(){
    explodesDiv.classList.remove("hidden");
    ejectedDiv.classList.add("hidden")
});
document.getElementById("sus").addEventListener("click", function(){
    ejectedDiv.classList.remove("hidden");
    explodesDiv.classList.add("hidden")
});
pastDates.addEventListener("change",function(){
    scam +=1

    importantDatesDiv.innerHTML="";
    importantMilestonesDiv.innerHTML="";
    importateDutiesDiv.innerHTML="";
    console.log(scam%2)
    if (scam % 2 != 0){
        fetch("https://ects-cmp.com/files/calendar.json?v=3")
        .then(resp => resp.json())
        .then(data => {
                processDateFile(data, true);               
        })
    } else{
        fetch("https://ects-cmp.com/files/calendar.json?v=3")
        .then(resp => resp.json())
        .then(data => {
                processDateFile(data);               
        })
    }
    
});
//Pulls dates from a cq
fetch("https://ects-cmp.com/files/calendar.json?v=3")
.then(resp => resp.json())
.then(data => {
        processDateFile(data);               
})
//Write start date and end date when you can think again
function processDateFile(data, show = false){
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
    if(show == true){
        dates(data.events, importantDatesDiv, true);
        dates(data.milestones, importantMilestonesDiv, true);
        dates(data.teacherduties, importateDutiesDiv, true, true);
    } else {
        dates(data.events, importantDatesDiv);
        dates(data.milestones, importantMilestonesDiv);
        dates(data.teacherduties, importateDutiesDiv, false, true);
    }
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


//the issue was that we are now passing in only the event data, so we don't need eventData.event[i], we just need eventData[i]
function dates(eventData,   targetDiv = importantDatesDiv,showPast = false, showcalendar = false){
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
            if(dayOffDate> currentDate && showPast == false){
                foundFutureDates = true;
                if(showcalendar){
                    newDiv +=
                 `                    
                    <li class="eventitem">  ${eventData[i].days[j]} <center><add-to-calendar-button 
                    id="css-part-example"
                    name="${eventName}"
                    startDate="${eventData[i].days[j]}"
                    options="'Apple','Google','Outlook.com','MicrosoftTeams'"
                    lightMode="bodyScheme"
                  ></add-to-calendar-button></center>                
                `;
                } else {
                    newDiv +=
                 `                    
                    <li class="eventitem">  ${eventData[i].days[j]} 
                  `;
                }
                
            }
            if(showPast == true){
                foundFutureDates = true;
                if(showcalendar){
                    newDiv +=
                 `                    
                    <li class="eventitem">  ${eventData[i].days[j]} <center><add-to-calendar-button 
                    id="css-part-example"
                    name="${eventName}"
                    startDate="${eventData[i].days[j]}"
                    options="'Apple','Google','Outlook.com','MicrosoftTeams'"
                    lightMode="bodyScheme"
                  ></add-to-calendar-button></center>                
                `;
                } else {
                    newDiv +=
                 `                    
                    <li class="eventitem">  ${eventData[i].days[j]} 
                  `;
                }
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
            return "bluemilestone";                    
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
        case "NOCTI MAKE UP WRITTEN TEST (SENIORS)":
            return "nocti";
        case "SENIOR AWARDS CEREMONY":
        case "LAST TEACHER DAY":
            return "teacher";
    }
}

function checkParams(){
    let params = new URLSearchParams(document.location.search);
    let showFile = params.get("showfileupload"); // is the string "Jonathan"
    if(showFile != undefined){
        document.getElementById("fileUpload").classList.remove("hidden");
    }
}