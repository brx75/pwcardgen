var version='1.2';

var key;

var charCodeRange = {
  start: 65,
  end: 90
};

var ascii_low = 33;
var ascii_high = 126;
var width=10;
var height=12;
var groupsize=3;
var filter="\\|£/()=^*][{}§~<>";

var symbol_map = ['&#x2600','&#x2601','&#x2602','&#x2603','&#x260E',
                  '&#x2618','&#x2620','&#x2622','&#x2623','&#x2624',
                  '&#x262D','&#x262E','&#x262F','&#x263A','&#x265A',
                  '&#x265E','&#x2660','&#x2661','&#x2662','&#x2663',
                  '&#x2664','&#x2665','&#x2666','&#x2667','&x#266A' ]; // map of nice Unicode/UTF-8 symbols

// pad function taken from "http://www.electrictoolbox.com/pad-number-zeroes-javascript/"
function pad(number, length,padding) {
    var str = '' + number;
    while (str.length < length) {
        str = padding + str;
    }
    return str;
}


function genpad(){

  var pad = [];
  for (var y=ascii_high;y > ascii_low; y--){
    for (var x=ascii_low; x < ascii_high ; x++ ){
      pad.push(String.fromCharCode(x));
      pad.push(String.fromCharCode(y));
    }
  }
 return pad.join('');
}

function encode(data,filter){
  var out;
  var l=data.length;
  
  for (var i=0; i <= data.length; i++){
    var a = data.charCodeAt(i);
    var v=(a % (ascii_high - ascii_low) + ascii_low);
    var c=String.fromCharCode(v);
    if (filter.indexOf(c) < 0){
      out += c;
    }
  }
  return out;
}

function getParameter ( queryString, parameterName ) {
  // Add "=" to the parameter name (i.e. parameterName=value)
  parameterName = parameterName + "=";
  if ( queryString.length > 0 ) {
    // Find the beginning of the string
    begin = queryString.indexOf ( parameterName );
    // If the parameter name is not found, skip it, otherwise return the value
    if ( begin != -1 ) {
      // Add the length (integer) to the beginning
      begin += parameterName.length;
      // Multiple parameters are separated by the "&" sign
      end = queryString.indexOf ( "&" , begin );
      if ( end == -1 ) {
        end = queryString.length;
      }
      // Return the string
      return unescape ( queryString.substring ( begin, end ) );
    }
    // Return "null" if no parameter has been found
    return "null";
  }
}

function printoutface(data,table,offset,w_min,w_max,h_min,h_max,groupsize,x_opt,y_opt){
  var i=0;
  var k=0;
  var s=0;
  var cell=[];
  
  var tr = document.createElement('tr');
  
  tr.setAttribute('class','row0');
  tr.setAttribute('id','tr0');
  
  cell[0] = document.createElement('th'); //empty cell for padding
  cell[0].innerHTML = " ";
  
  tr.appendChild(cell[0]);

  //Table heading row
  for (var ix = w_min+1; ix <= w_max; ix++){
    cc = ix+charCodeRange.start-1;
    c2 = ix+charCodeRange.start+w_max-1;

    ec=ix % 2;


    cell[ix] = document.createElement('th');
    cell[ix].setAttribute('class','hhead'+ec);
    cell[ix].setAttribute('id','th'+cc);
    if (x_opt == "x_alpha"){
          cell[ix].innerHTML = String.fromCharCode(cc);
      } else if (x_opt == "x_multi"){
          cell[ix].innerHTML = String.fromCharCode(cc) + String.fromCharCode(c2) + "<br>" + pad(k,2,'0') + "<br>" + symbol_map[k+s];
      } else {
      cell[ix].innerHTML = ix-1;
    }
    tr.appendChild(cell[ix]);
    
    k++;
  }

  s = k;
  table.appendChild(tr);

  i=offset;
    
  var row=[];

  k=h_min;
  for (var iy=h_min+1;iy <= h_max+1; iy++){
    
    er = iy % 2;
    
    row[iy]=document.createElement('tr');
    row[iy].setAttribute('class','row'+ er);
    row[iy].setAttribute('id','tr'+iy);
    
    cell=[];
    
    cc = iy+charCodeRange.start-1;
    c2 = iy+charCodeRange.start-1+h_max;

    //Table left heading column
    cell[0] = document.createElement('th');
    cell[0].setAttribute('class','vhead'+er);
    cell[0].setAttribute('id','th'+cc);
    if (y_opt=="y_alpha"){
      cell[0].innerHTML = String.fromCharCode(cc);
      } else if (y_opt == "y_multi"){
          cell[0].innerHTML = String.fromCharCode(cc) + String.fromCharCode(c2) + pad(k,2,'0')+ "<br>" + symbol_map[k+s];
    } else {
      cell[0].innerHTML = iy-1;
    }
    row[iy].appendChild(cell[0]);
    k++;
    
    for (ix = w_min+1; ix <= w_max; ix++){
    
      var a = data.substr(i*groupsize,groupsize);
      
      ec=ix % 2;

      cell[ix] = document.createElement('td');
      cell[ix].setAttribute('class','row'+er+'col'+ec);
      cell[ix].setAttribute('id','td'+ix + "_" + iy);
      cell[ix].innerHTML = a;
      row[iy].appendChild(cell[ix]);
      i++;
    }
    table.appendChild(row[iy]);
  }
  
  return i;

}


function printout(data,width,height,groupsize,x_opt,y_opt){
  var i=printoutface(data,
    document.getElementById("frontCardTable"),
    0,0,width,0,height/2-1,
    groupsize,
    x_opt,y_opt);
  printoutface(data,document.getElementById("backCardTable"),
    i,0,width,(height/2),height-1,
    groupsize,
    x_opt,y_opt);
}

function genPasswordCard(key,filter){

  var pad = genpad();
  var ciphertext = encrypt(key,pad);
  //document.write("<p>ciphertext: "+ ciphertext + "</p>");

  var encodedtext = encode(ciphertext,filter);

  return encodedtext;
}


function getKeyFromTextArea(){
  key = document.getElementById('keyTextArea').value;
  genKeyDiv=document.getElementById("genKey");
  keyTextArea=document.getElementById("keyTextArea");
  button=document.getElementById("genButton");

  genKeyDiv.removeChild(keyTextArea);
  genKeyDiv.removeChild(button);

  document.getElementById('thecard').style.visibility = 'visible';
  document.getElementById('frontCard').style.visibility = 'visible';
  document.getElementById('backCard').style.visibility = 'visible';
  
  var heading=document.getElementById('heading');
  var footer=document.getElementById('footer');

  document.body.removeChild(heading);
  document.body.removeChild(footer);
  document.body.removeChild(genKeyDiv);

  
  var encodedtext = genPasswordCard(key,filter);

  printout(encodedtext,width,height,groupsize,"x_multi","y_multi");
}

function main(){
  key = getParameter (window.top.location.search,"key");

  if (key == null){
    genKeyDiv=document.getElementById("genKey");
    
    document.getElementById('frontCard').style.visibility = 'hidden';
    document.getElementById('backCard').style.visibility = 'hidden';
    
    var keyTextArea = document.createElement('textarea');
    keyTextArea.setAttribute('placeholder','Write here the key to use for generate your passwordCard');
    keyTextArea.setAttribute('id','keyTextArea');
    keyTextArea.setAttribute('required','true');
    keyTextArea.setAttribute('cols','40');
   genKeyDiv.appendChild(keyTextArea);
    
    var buttonnode= document.createElement('input');
    buttonnode.setAttribute('id','genButton');
    buttonnode.setAttribute('type','button');
    buttonnode.setAttribute('name','Generate');
    buttonnode.setAttribute('value','Generate');
    genKeyDiv.appendChild(buttonnode);
    buttonnode.onclick = getKeyFromTextArea;

  }
else
  {
    var encodedtext = genPasswordCard(key,filter);
    printout(encodedtext,width,height,groupsize,"x_multi","y_multi");
 }
}
