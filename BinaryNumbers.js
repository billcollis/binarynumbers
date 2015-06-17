"use strict";

//by Bill Collis  www.techideas.co.nz & www.XplainItToMe.com
//idea adapted from Tim Bell's work http://csunplugged.org/ 
//copyright 

//sort 15 tiles in the binary sequence (the 16th tile is fixed in position)


//html document is ready so begin
$(document).ready(function () {
    $(".sortable").sortable(                //jquery sortable functions
        {
            update: function (event, ui)    //event for when the user has mived a sortable tile
            {
                checkpositions(ui.item[0].dataset.value, ui.item.index()); //check to see if the tiles are in order
                if (sortersInOrder)
                    displayBin()           //if the tiles are in order then display the buttons
            }
        },
        {items:'> li:not(.pin)'}            //pin (make unmoveable) the '1' to righthandside '>'
    );
    createSorters();                        //make the 15 moveable
});

var sortersInOrder = false;                 //will become true when the 16 elements are sorted
var total = 0;                              //keep track of the users total as they go
var clickcount = 0;                         //how many times the user moves a token
var correctnumbits=0;
var question;                               //the number the user must make
var starttime;                              //lkeep track of how long the user takes by recordein gtheir start time 
 
//these buttons appear after the tiles are sorted
$("#bin").buttonset();                      //jquery check type buttons that the user clicks on        
$("#hex").buttonset();                      //buttons are used here so that they all look the same - even though they are never responded to when the user clicks tem
$("#start").button();                       //generates a random number for the user to work out

//this creates the 16 tiles the user must sort (note the last tile arr[0] is the '1' and is not sortable
function createSorters()
{
    var ul = document.getElementById("sorters")         //find the unorder list 
    var arr = [15, 14, 13, 12, 11, 10, 9, 8,7, 6, 5, 4, 3, 2, 1] //array of 15 numbers for the powers of 2. s^15=32768 ... 2^1=2
    shuffle(arr);                                       //mess up the numbers in the array
    arr.unshift(0);                                     //add 0 to end of the array for 2^0 = 1
    for (var i = 15; i >= 0; i--) {
        var li = document.createElement('li');          //list element
        ul.appendChild(li);                             //add list element
        li.className += " ui-state-default";            //add css
        li.setAttribute("id","sorter"+arr[i])           //give each li element a unique id
        li.dataset.value = arr[i];                      //creates a data element for each li element with a strin gof the power in it
        var elem = document.createElement("img");       //add an image element to each li element
        elem.setAttribute("src", "images/_" + arr[i] + ".svg");     //load the image
        elem.setAttribute("alt", Math.pow(2,arr[i]));   //if the image doesnt load add an alternative which is the number 32768....4,2,1 
        li.appendChild(elem)                            //add the image to the list element
    }
    li.className += " pin"                              //pin means unmovable - so '1' is not sortable
}

//need to identify if the user has got the tiles in order
function checkpositions(value, index) {
    var newpos = parseInt(value,10);                    //get the value of the tile
    index = 15 - index                                  //ui is from right to left, we need L to R
    if (index === newpos) {                             //is it in the right place
        var lis = document.getElementById("sorters").getElementsByTagName("li");
        //var x = "";
        var count = 0;                                  //we check t14 times to see if the 15 tiles are in order
        for (var i = 0; i < 15; i++) {
            //x += ":" + lis[i].dataset.value;
            if (lis[i].dataset.value > lis[i + 1].dataset.value)    //check if the tile we have come to is > the tile toits left
                count++;
        }
        if (count === 14)                               //if we have found 14 true comparisons the 15 tiles muts be in order
            sortersInOrder = true;
    }
    else {                                              //the tiles are not sorted, we put thi shere so that if the user moves the tiles once they are playing , then the buttons become hidden again
        sortersInOrder = false;
        var b = document.getElementById("bin")
        b.hidden = "hidden";
        var h = document.getElementById("hex")
        h.hidden = "hidden";
        var q = document.getElementById("question")
        q.hidden = "hidden";
    }
}


//event for when user clicks a binary button
$("input[name='bin']").on("change", function () { 
    total=0;
    if ($(this).is(':checked')) {                   //first change the tile between 1 and 0
        $(this).button('option','label',1)
    }
    else {
        $(this).button('option', 'label', 0)
    }
    
    for (var i = 0; i < 16; i++)                //for each bin button
    {
        if ($("#check" + i).is(':checked')) {   // is it checked
            total += parseInt(document.getElementById("check" + i).value,10)    //, turn the text value stored in each button into a number (in base10) and add value to user total 
        }
    }

    //change the hex buttons
    var hexstr = total.toString(16);    //turn the number into a string
    if (total < 4096)                   //add extra 0's so we always have 4 digits e.g. 0x0002, 0x003E
        hexstr = '0' + hexstr;
    if (total < 256)
        hexstr = '0' + hexstr;
    if (total < 16)
        hexstr = '0' + hexstr;
    if (total < 1)
        hexstr = '0' + hexstr;
    hexstr = hexstr.toUpperCase();     //make the hex digits A-F upper case

    //put the 4 hex digits onto the buttons
    $("#hex3").button('option', 'label', hexstr[0]);
    $("#hex2").button('option', 'label', hexstr[1]);
    $("#hex1").button('option', 'label', hexstr[2]);
    $("#hex0").button('option', 'label', hexstr[3]);

    //show the user their total so far
    document.getElementById("total").innerHTML = "   (your total:"+total+")";
    clickcount++;                   //add to the click count
    
    //the user has got it right
    if (question === total) {
        var now = Date.now() - starttime;                   //how long the user took in millisecods
        now /= 1000;                                        //convert to seconds
        var errors = (clickcount - correctnumbits) / 2;     //number of errors the user did - an error is if they click a button and then unclick it, so need to divide by 2
        var message;
        //choose the message to display to the user
        if (errors === 0)
            message = "  --- *** EXCELLENT ***";
        else if (errors === 1)
            message = "   --- ** AWESOME **";
        else if (errors === 2)
            message = "  --- * WELLDONE *";
        else if (errors < 10 )
            message = " --- GREAT"
        else 
            message = " --- You need a little more practice"
        now = Math.round(now);

        message += " --- (you made " + (clickcount - correctnumbits) / 2 + " errors   and took " + now + " seconds)";
        document.getElementById("total").innerHTML = message;           //show the message in the HTML document
    }

});

//user has sorted the tiles and presses the start button to generate a random number
function start() 
{
    for (var i = 0; i < 16; i++) {                      //make sure all the bin buttons are unchecked
        $("#check" + i).prop('checked', false);
    }
    
    for (var i = 0; i < 16; i++) {                      //all bin buttons back to 0
        $("#check" + i).button('option', 'label', 0)
    }
    for (var i = 0; i < 4; i++) {                       //all the hex buttons back to 0
        $("#hex" + i).button('option', 'label', 0)
    }
    question = 0;                                       
    starttime = Date.now();                             //capture the start time
    var max = 65535;                                    //the max random number we will generate
    var min = 2;                                        //the min random number we will generate
    question = Math.floor(Math.random() * (max - min + 1)) + min;       //get a random number in the range min to max (inclusive range)
    total = 0;                                          //reset the other vars we will use
    clickcount = 0;
    correctnumbits = 0;

    //about 1 in every 5 goes generate a hex number for the user to find 
    max = 5;
    min = 1;
    var rnd = Math.floor(Math.random() * (max - min + 1)) + min;    //make a random number 1 to 5
    if (rnd % 5 === 0)                                              //see if the rnd/5 ===0 
        document.getElementById("value").innerHTML = "Click the binary digits for: 0x" + question.toString(16).toUpperCase();
    else
        document.getElementById("value").innerHTML = "Click the binary digits for: " + question;
    document.getElementById("total").innerHTML = "";
    
    //number of bits in correct answer - used to calculate how many extra clicks the user took
    var s = question.toString(2);
    for (var i = 0; i < s.length; i++)
        if (s[i] === "1")
            correctnumbits++;
}

//show the bin and hex buttons to the user
function displayBin()
{
    var bdiv = document.getElementById("bin")
    bdiv.hidden = false;

    //display hex
    var hdiv = document.getElementById("hex")
    hdiv.hidden = false;
    var q = document.getElementById("question")
    q.hidden = false;
}

//mix up the 15 numbers in the array
function shuffle(array) 
{
    var temporaryvalue;
    //for testing purposes uncomment this code so that only the middle 3 tiles need sorting
    /*
    for (var i = 0; i < 6; i++) //temp shuffle the middle 3 only for quicker testing puposes
    {
        temporaryvalue = array[i];
        array[i] = array[14-i];
        array[14-i] = temporaryvalue
    }
    return array;
    */

    //shuffle the 15 tiles - every tile will be out of place
    var currentIndex = array.length, temporaryValue, randomIndex;

    // while there remain tiles to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining tile...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current tile.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
