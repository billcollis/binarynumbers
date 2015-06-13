"use strict";

//by Bill Collis  www.techideas.co.nz
//idea adapted from Tim Bell's work http://csunplugged.org/ 
//copyright statement - just dont steal it and put your name on it!!

$(document).ready(function () {
    $(".sortable").sortable(
        {
            update: function (event, ui)
            {
                checkpositions(ui.item[0].dataset.value, ui.item.index());
                if (sortersInOrder)
                    displayBin()
            }
        },
        {items:'> li:not(.pin)'} //pin '1' to righthandside
    );
    createSorters();
});

var sortersInOrder = false;
var total = 0;
var clickcount = 0;
var correctnumbits=0;
var question;
var starttime;
$("#bin").buttonset();
$("#hex").buttonset();
$("#start").button();

function createSorters()
{
    var ul = document.getElementById("sorters")
    var arr = [15, 14, 13, 12, 11, 10, 9, 8,7, 6, 5, 4, 3, 2, 1]
    shuffle(arr);
    arr.unshift(0); //make sure 1st element is in position
    for (var i = 15; i >= 0; i--) {
        var li = document.createElement('li');
        //li.onclick=sorterclicked;;
        ul.appendChild(li);
        li.className += " ui-state-default";
        li.setAttribute("id","sorter"+arr[i])
        li.dataset.value = arr[i]; //creates a string 
        var elem = document.createElement("img");
        elem.setAttribute("src", "images/_" + arr[i] + ".svg");
        elem.setAttribute("alt", Math.pow(2,arr[i]));
        li.appendChild(elem)
    }
    li.className += " pin" //pin '1' so not sortable
}
function sorterclicked()
{

}
function checkpositions(value, index) {
    var newpos = parseInt(value,10); 
    index = 15 - index //ui is from right to left, we need L to R
    if (index === newpos) {
        var lis = document.getElementById("sorters").getElementsByTagName("li");
        var x = "";
        var count = 0;
        for (var i = 0; i < 15; i++) {
            x += ":" + lis[i].dataset.value;
            if (lis[i].dataset.value > lis[i + 1].dataset.value)
                count++;
        }
        if (count === 14)
            sortersInOrder = true;
    }
    else
    {
        sortersInOrder = false;
        var b = document.getElementById("bin")
        b.hidden = "hidden";
        var h = document.getElementById("hex")
        h.hidden = "hidden";
        var q = document.getElementById("question")
        q.hidden = "hidden";
    }
}

$("input[name='bin']").on("change", function () { 
    total=0;
    if ($(this).is(':checked')) {
        //total += parseInt(this.value);
        $(this).button('option','label',1)
    }
    else {
        //total -= parseInt(this.value);
        $(this).button('option', 'label', 0)
    }
    
    for (var i = 0; i < 16; i++)//had errors with above totalling
    {
        if ($("#check" + i).is(':checked')) { // $("#check" + i).button('option', 'label', 0)
            total += parseInt(document.getElementById("check" + i).value,10)
            //total += parseInt(("#check" + i).value)
        }
    }

    //change the hex value
    var hexstr = total.toString(16);
    if (total < 4096)
        hexstr = '0' + hexstr;
    if (total < 256)
        hexstr = '0' + hexstr;
    if (total < 16)
        hexstr = '0' + hexstr;
    if (total < 1)
        hexstr = '0' + hexstr;
    hexstr = hexstr.toUpperCase();

    //document.getElementById("x").innerHTML = hexstr;

    $("#hex3").button('option', 'label', hexstr[0]);
    $("#hex2").button('option', 'label', hexstr[1]);
    $("#hex1").button('option', 'label', hexstr[2]);
    $("#hex0").button('option', 'label', hexstr[3]);

    document.getElementById("total").innerHTML = "   (your total:"+total+")";
    clickcount++;
    

    if (question === total) {
        var now = Date.now() - starttime;
        now /= 1000; //seconds
        var errors = (clickcount - correctnumbits) / 2;
        var message =""
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
        document.getElementById("total").innerHTML = message;
    }

});

function start() 
{
    for (var i = 0; i < 16; i++) { //make sure they are all unchecked
        $("#check" + i).prop('checked', false);
    }
    //all bin bits back to 0
    for (var i = 0; i < 16; i++) {
        $("#check" + i).button('option', 'label', 0)
    }
    for (var i = 0; i < 4; i++) {
        $("#hex" + i).button('option', 'label', 0)
    }
    question = 0;
    starttime = Date.now();
    var max = 65535;
    var min = 2;
    question = Math.floor(Math.random() * (max - min + 1)) + min;
    total = 0;
    clickcount = 0;
    correctnumbits = 0;

    //randomly choose to do a hex number
    max = 5;
    min = 1;
    var rnd = Math.floor(Math.random() * (max - min + 1)) + min;
    if (rnd % 5 === 0) //1 in 5
        document.getElementById("value").innerHTML = "Click the binary digits for: 0X" + question.toString(16).toUpperCase();
    else
        document.getElementById("value").innerHTML = "Click the binary digits for: " + question;
    document.getElementById("total").innerHTML = "";
    //number of bits in correct answer

    var s = question.toString(2);
    for (var i = 0; i < s.length; i++)
        if (s[i] === "1")
            correctnumbits++;
}
function displayBin()
{
    var bdiv = document.getElementById("bin")
    bdiv.hidden = false;
    //for (var i = 15; i >= 0; i--) {
    //    var inp = document.createElement('input');        
    //    d.appendChild(inp);
    //    inp.className += "binarybtn";
    //    inp.setAttribute("type", "checkbox")
    //    inp.setAttribute("id", "check"+i)
    //    inp.className += " ui-state-default";
    //    //var lbl = document.createElement('label');
    //    //lbl.for="check"+i;
    //    //lbl.className += "binarybtn";
    //    //lbl.innerHTML = 0;
    //    //$(".selector").button("option", "disabled", true);
    //}
    //$("#binarydiv").buttonset('refresh');

    //display hex
    var hdiv = document.getElementById("hex")
    hdiv.hidden = false;
    var q = document.getElementById("question")
    q.hidden = false;
}
function shuffle(array) 
{
    var temporaryvalue;
    //for (var i = 0; i < 6; i++) //temp shuffle the middle 3 only for quicker testing puposes
    //{
    //    temporaryvalue = array[i];
    //    array[i] = array[14-i];
    //    array[14-i] = temporaryvalue
    //}
    //return array;

    //real shuffle here
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
