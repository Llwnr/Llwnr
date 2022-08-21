//Initializing variables
var calender = document.querySelector('.calender-container');
var day = 1;
var totalDays;
var monthIndex = 0;//0 is first month, 1 is second month etc
var inputDiv;//Only one at a time
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthMaxDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

//To store data
var notifiedElements = new Array();
var notifiedElementsInput = new Array();

function CreateCalendar(){
    //Reset totalDays for each calculation
    totalDays = 0;
    //Calculate Total Days
    for(let i=0; i<monthIndex; i++){
        totalDays += monthMaxDays[i];
    }
    
    //Creating heading
    const heading = document.createElement("div");
    heading.classList.add("heading", "permanent");
    const monthName = document.createElement("span");
    monthName.classList.add("gridMonth");
    monthName.innerHTML = monthNames[monthIndex];
    const btnLeft = document.createElement("button");
    btnLeft.addEventListener('click', GenerateNextMonthLeft);
    btnLeft.innerHTML = "<";
    const btnRight = document.createElement("button");
    btnRight.addEventListener('click', GenerateNextMonthRight);
    btnRight.innerHTML = ">";
    heading.append(monthName, btnLeft, btnRight);
    calender.appendChild(heading);

    //Creating sunday-saturday
    const div = document.createElement("div");
    div.classList.add("permament");
    const dayNames = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
    for(var i=0; i<7; i++){
        const dayName = document.createElement("span");
        dayName.classList.add("days");
        dayName.innerHTML = dayNames[i];
        div.appendChild(dayName);
    }
    calender.appendChild(div);
    
    day = 1;
    let nullDay = 0;
    //Creating weeks
    for(var i = 0; i < 7; i++){
        const week = document.createElement("div");
        //Creating days
        
        for(var j = 0; j < 7; j++){
            const dayNum = document.createElement("span");
            dayNum.classList.add("day-num");
            dayNum.addEventListener('click', function (){
                //Check if input is null and if the notification tag already exists
                let children = dayNum.children;
                let inputExists = false;
                for(let i=0; i<children.length; i++){
                    //If the selected day has a notification tag then don't open input box but open options box
                    if(children[i].classList.contains("notifTag")){
                        inputExists = true;
                        //Get the day's date
                        let dayData = '';
                        for(let k=0; k<2; k++){
                            if(dayNum.innerHTML[k] != "<") dayData += dayNum.innerHTML[k];
                        }
                        //Search for the index of that data
                        const index = JSON.parse(localStorage.getItem(monthIndex)).indexOf(dayData);

                        const notifData = document.createElement("div");
                        notifData.classList.add("notifData");
                        notifData.innerHTML = JSON.parse(localStorage.getItem(monthIndex + " input"))[index];
                        dayNum.appendChild(notifData);
                        dayNum.addEventListener("mouseout", function(){
                            notifData.remove();
                        })
                    }
                }
                if(inputDiv == null && !inputExists){
                    //Create Input Box
                    dayNum.appendChild(CreateInputDiv(this));
                    inputDiv.focus();
                }
            });
            //Create null days from totalDays%7 formula
            if(nullDay<(totalDays%7)){
                dayNum.innerText = "";
                nullDay++;
                console.log(nullDay);
            }
            //If all the null days are created then start creating days with numbers
            else{
                dayNum.innerText = JSON.stringify(day);
                day++;
            }
            

            week.appendChild(dayNum);
            //Stop loop once dayNumber reaches max for the month
            if(day > monthMaxDays[monthIndex]){
                break;
            }
        }
        calender.appendChild(week);
        if(day > monthMaxDays[monthIndex]){
            break;
        }
    }
    //Load notification data
    LoadInput();
}




function GenerateNextMonthLeft(){
    //If you're at january then you won't go left
    if(monthIndex>0){
        monthIndex--;
        ChangeCalendarDays();
        CreateCalendar();
    }
}

function GenerateNextMonthRight(){
    //If you're at december then you won't go right
    if(monthIndex<11){
        monthIndex++;
        ChangeCalendarDays();
        CreateCalendar();
    }
}

//Change only the days number and not the heading tags
function ChangeCalendarDays(){
    calender.innerHTML = "";
}

//For user to type their notification message
function CreateInputDiv(e){
    inputDiv = document.createElement("input");
    inputDiv.classList.add("input");
    //Get position of parent element
    let rect = e.getBoundingClientRect();
    inputDiv.style.left = `${rect.left + 70}px`; 
    inputDiv.style.top = `${rect.top}px`;
    inputDiv.addEventListener('blur', function(){
        //Remove the inputBox
        inputDiv.remove();
        //Make the variable null for line no. 78
        inputDiv = null;
    });
    //When you submit the input
    inputDiv.addEventListener('keydown', function(){
        //After submitting input save it for notification
        if(event.key == 'Enter' && inputDiv.value.length != 0){
            //Add the notification tag
            const notifTag = document.createElement('img');
            notifTag.setAttribute("src", "https://icones.pro/wp-content/uploads/2022/02/icone-de-cloche-jaune.png");
            notifTag.classList.add("notifTag");
            notifTag.style.left = `${rect.left+45}px`;
            notifTag.style.top = `${rect.top + 50}px`;
            inputDiv.parentElement.appendChild(notifTag);
            //Save to localStorage
            StoreInput(e.innerHTML, inputDiv.value);

            //Remove the input box
            inputDiv.remove();
            inputDiv = null;
        }
    });
    return inputDiv;
}

//For SAVING FUNCTION INTO LOCAL STORAGE
function StoreInput(day, input){
    //Get the day where you set notification
    let dayData = "";
    for(let i=0; i<2; i++){
        if(day[i] != "<"){//Checking if its the beginning of a tag for example <input>
            dayData += day[i];
        }
    }
    notifiedElements = JSON.parse(localStorage.getItem(monthIndex));
    if(notifiedElements == null){
        notifiedElements = [];
    }
    notifiedElements.push(dayData);
    localStorage.setItem(monthIndex, JSON.stringify(notifiedElements));

    if(notifiedElementsInput == null){
        notifiedElementsInput = [];
    }
    notifiedElementsInput.push(input);
    localStorage.setItem(`${monthIndex + " input"}`, JSON.stringify(notifiedElementsInput));
}

//For LOADING THE NOTIFICATIONS SET IN CALENDAR
function LoadInput(){
    const storedElements = JSON.parse(localStorage.getItem(monthIndex));
    if(storedElements != null){
        storedElements.forEach(function (dayNum){
            //Convert the day num to the position in the element
            let rowChild = Math.floor((dayNum-1+(totalDays)%7)/7);
            rowChild+=2;//Since the first two children are gonna be heading and sun,mon,tues days etc we want to skip those
            let columnChild = (dayNum-1+(totalDays)%7)%7;
            //Add the notification tag
            let rect = calender.children[rowChild].children[columnChild].getBoundingClientRect();
            const notifTag = document.createElement('img');
            notifTag.setAttribute("src", "https://icones.pro/wp-content/uploads/2022/02/icone-de-cloche-jaune.png");
            notifTag.classList.add("notifTag");
            notifTag.style.left = `${rect.left+45}px`;
            notifTag.style.top = `${rect.top + 50}px`;
            calender.children[rowChild].children[columnChild].appendChild(notifTag);
        });
    }
}