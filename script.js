////////////////////////////  
// COLOR GRADIENT CHANGER //
////////////////////////////

// LEFT SIDE // #370b58
const L_grad_lower_R = 0x37;
const L_grad_lower_G = 0x0B;
const L_grad_lower_B = 0x58; 
// #c11258
const L_grad_upper_R = 0xC1;
const L_grad_upper_G = 0x12;
const L_grad_upper_B = 0x58; 

const L_base = (L_grad_lower_R*0x10000) + (L_grad_lower_G*0x100) + L_grad_lower_B;

const L_diff_R = L_grad_upper_R - L_grad_lower_R;
const L_diff_G = L_grad_upper_G - L_grad_lower_G;
const L_diff_B = L_grad_upper_B - L_grad_lower_B;

// RIGHT SIDE // #262454
const R_grad_lower_R = 0x26;
const R_grad_lower_G = 0x24;
const R_grad_lower_B = 0x54; 
// #7827d1
const R_grad_upper_R = 0x78;
const R_grad_upper_G = 0x27;
const R_grad_upper_B = 0xD1; 

const R_base = (R_grad_lower_R*0x10000) + (R_grad_lower_G*0x100) + R_grad_lower_B;

const R_diff_R = R_grad_upper_R - R_grad_lower_R;
const R_diff_G = R_grad_upper_G - R_grad_lower_G;
const R_diff_B = R_grad_upper_B - R_grad_lower_B;

// sin function ranges
var sin_slider = -89; // progress
var direction = 1.7; // doubles as speed, can be modifed to whatever speed

// setup our reference
var backgroundcolR = document.getElementById("colR");
// secondary references
var bordercol1 = document.getElementById("bord1");
var bordercol2 = document.getElementById("bord2");
var bordercol3 = document.getElementById("bord3");


var interval = setInterval(function() {
    // UPDATE INTERP DEGREES + LIMIT DEGREES //
    if (Math.abs(sin_slider >= 90))
    {
        direction *= -1; // FLIP DIRECTION //
    }
    sin_slider += direction
    var interp_percent = (Math.sin(sin_slider * (Math.PI / 180))+1)/2;

    var curr_L_base = L_base;
    var curr_R_base = R_base;
    // APPLY CHANGE TO COLORS //
    curr_L_base += (Math.trunc(L_diff_R*interp_percent)*0x10000) 
                +  (Math.trunc(L_diff_G*interp_percent)*0x100) 
                +   Math.trunc(L_diff_B*interp_percent);

    curr_R_base += (Math.trunc(R_diff_R*interp_percent)*0x10000) 
                +  (Math.trunc(R_diff_G*interp_percent)*0x100) 
                +   Math.trunc(R_diff_B*interp_percent);

    // DEBUG //
    var L_grad_color = "#" + curr_L_base.toString(16);
    var R_grad_color = "#" + curr_R_base.toString(16);
    //console.log(L_grad_color + " " + R_grad_color + ", sin out: " + interp_percent);

    // SET COLORS //
    backgroundcolR.style.background = `linear-gradient(to left, ${R_grad_color}, ${L_grad_color})`;

    // SET SECONDARY COLORS //
    bordercol1.style.background = `linear-gradient(to left, ${L_grad_color}, ${R_grad_color})`;
    bordercol2.style.background = `linear-gradient(to left, ${L_grad_color}, ${R_grad_color})`;
    bordercol3.style.background = `linear-gradient(to left, ${L_grad_color}, ${R_grad_color})`;

}, 100); // Run every 0.1 seconds


//////////////////////
// VALUE CONVERTERS //
//////////////////////

var decBox = document.getElementById("decField");
var decBut = document.getElementById("decClick");
decBut.onclick = function(){
    let numba = Number(decBox.value);
    writeConvertedNum(numba);
}

var hexBox = document.getElementById("hexField");
var hexBut = document.getElementById("hexClick");
hexBut.onclick = function(){
    let numba = parseInt(hexBox.value, 16);
    writeConvertedNum(numba);
}

var binBox = document.getElementById("binField");
var binBut = document.getElementById("binClick");
binBut.onclick = function(){
    let numba = parseInt(binBox.value, 2);
    writeConvertedNum(numba);
}

function writeConvertedNum(numba)
{
    if (!Number.isNaN(numba)){
        console.log("inNum : " + numba);
        decBox.value = numba.toString();
        hexBox.value = numba.toString(16);
        binBox.value = numba.toString(2);
    }
    else{
        console.log("Invalid value");
    }
}


/////////////////////
// HEX BITSHIFTING //
/////////////////////

var test = document.getElementById("shiftClick");
var shiftBox = document.getElementById("shiftBox"); // the shift functionality
test.onclick = function(){
    let carried = false;
    let last_carried = false;
    let new_string = "";
    for (i = 0; i < shiftBox.value.length; i += 2)
    {
        if (i == shiftBox.value.length-1) // then this is an odd one out
        {
            console.log("odd hex value left");
            // shouldn't be a possibility really, but it might do that actually
        }
        else
        {
            let hex_code = String(shiftBox.value).substring(i, i+2);
            let numba = parseInt(hex_code, 16); // convert to an int
            //console.log(numba);

            last_carried = carried;
            carried = (numba % 2) // if 1 left over
            numba >>= 1;
            if (last_carried)
            {
                numba += 128;
            }
            if (numba < 16)
            {
                new_string += "0";
            }
            new_string += numba.toString(16);
        }
    }
    shiftBox.value = new_string;
}
// copy & paste stuff // dont really need the copy, slightly convenient but not really because of the prompt
// var shiftCopy = document.getElementById("shiftCopy");
// shiftCopy.onclick = function() {
//     shiftBox.select();
//     document.execCommand("copy");
// }
var shiftPaste = document.getElementById("shiftPaste");
shiftPaste.onclick = async function() {
    var pastedText = await navigator.clipboard.readText();
    shiftBox.value = pastedText;
}