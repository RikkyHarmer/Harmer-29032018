'use strict'
//Require node.js File System
var fs = require("fs");
//Function to read in a file
function readfile (path) 
{
    return fs.readFileSync(path).toString();
};

//Product constructor for holding product data
function product (code, quant, letter, number)
{
    this.product_code = code;
    this.quantity = quant;
    this.pick_location =
    {
        'letter': letter,
        'number': number
    };
};

//Read in the file input.csv
var inputFile = readfile("input.csv")


//Split the data from the inputFile
splitData(inputFile);


function splitData (dataFile)
{
    //Create arrays to store the lines, products and sortedProducts
    var lines = [];
    var products = [];
    var sortedProducts = [];
    
    //Split the input into lines by splitting on the new line Chars
    lines = inputFile.split("\r\n");

    //loop over the lines
    for (var i = 1; i < lines.length - 1; i++)
    {
        // create arrays to store dataparts and location parts
        var dataparts = [];
        var locationparts = [];
        //split the lines into seperate data by splitting on the comma
        dataparts = lines[i].split(",");
        //split the pick location data into letters and numbers by splitting on the space
        locationparts = dataparts[2].split(" ");
        //Store each new product in the array Products
        products[i - 1] = new product (dataparts[0], dataparts[1], locationparts[0], locationparts[1]);
    }
    //Call sortData to sort the products
    sortData(products, sortedProducts)

}

function sortData (data, sortedProducts)
{
    //Create arrays for the indexes, codes and quantities of the current minimum shelf letter and number
    var indexes = [];
    var code = [];
    var quantity = [];
    //set min values to large values to allow for comparison
    var minStr = "ZZZZZZZZZZZZZZZZZZ";
    var minNum = "100000000000";
    //loop over the data
    for (var i = 0; i < data.length; i++)
    {
        //using the made strcmp function check if the value of products shelf letter is smaller than the current minimum
        if (strcmp(minStr, data[i].pick_location.letter) == 1)
        {
            //if it is reset arrays using the clear array function
            clearArray(indexes);
            clearArray(code);
            clearArray(quantity);
            //push the new values into the arrays and set the minimum values and add the index to the indexes array
            code.push(data[i].product_code);
            quantity.push(data[i].quantity);
            minStr = data[i].pick_location.letter;
            minNum = data[i].pick_location.number;
            indexes.push(i);
        }
        //if the shelf letter is the same 
        else if (strcmp(minStr, data[i].pick_location.letter) == 0)
        {
            //compare the shelf numbers to check minimum shelf
            if (strcmp (minNum, data[i].pick_location.number) == 1)
            {
                //if the shelf number is less than the current minimum shelf than clear arrays
                clearArray(indexes);
                clearArray(code);
                clearArray(quantity);
                //set new code data and quantity data then set the new min shelf number and add the index to the indexes array
                code.push(data[i].product_code);
                quantity.push(data[i].quantity);
                minNum = data[i].pick_location.number;
                indexes.push(i)
            }
            //if the shelf numbers are the same
            else if (strcmp (minNum, data[i].pick_location.number) == 0)
            {
                //loop over product codes to see if any matches
                for (var j = 0; j < code.length; j++)
                    //if there is a match
                if (strcmp(code[j], data[i].product_code) == 0)
                {
                    //convert the quantity at the same position to int and the data to an int and sum them together
                    var sum = parseInt(quantity[j],10) + parseInt(data[i].quantity,10);
                    //change sum to string and store it back in quantity
                    quantity[j] = sum.toString();
                    //get the index of the original product code from indexes
                    var index = indexes[j];
                    //store new quantity in the product constructor
                    data[index].quantity = quantity[j];
                    //remove the duplicate product from the products array
                    data.splice(i, 1);
                }
                //if product codes do not match
                else
                {
                //add product index to array
                indexes.push(i);
                }
            }
        }
    }
    //loop over indexes of products
    for (var j = 0; j < indexes.length; j++)
    {
        //set index to current stored index
        var index = indexes[j];
        //add data to sortedproduct array (offset by index-j)
        sortedProducts.push(data[index - j]);
        //splice the data based on index offset by j due to this splice
        data.splice(index - j, 1);
    }  
        
    //if there are still more products left to be sorted recursively call sortData
    if (data.length != 0)
    {
    sortData(data, sortedProducts);
    }
    //else if there are no more products to be sorted write data to file
    else if (data.length == 0)
    {
    writeFile(sortedProducts);
    }
}

//a function to clear the arrays
function clearArray(array)
{
    array.splice(0,array.length);
    return array
}

//function to compare strings based on the charCode value of the whole string
function strcmp(str1, str2)
{
    //set values to 0
    var str1val = 0;
    var str2val = 0;
    //loop over 1st string summing the char codes
    for (var i = 0; i < str1.length; i++) 
    {
        str1val += str1.charCodeAt(i);
    }
    //loop over 2nd string summing the char codes
    for (var j = 0; j < str2.length; j++)
    {
        str2val +=  str2.charCodeAt(j);
    }
    //if the 1st string value is greater than the 2nd return 1
    if (str1val > str2val)
    {
        return 1;
    }
    //if both string values are equal return 0
    else if (str1val == str2val)
    {
        return 0;
    }
    //if the 2nd string values are greater than the 1st return -1
    else if (str1val < str2val)
    {
        return -1;
    }
}

//function to write the data to file
function writeFile(data)
{
    //create write data with the headings for the file
    var writeData = "product_code,quantity,pick_location\r\n";
    //loop over the data adding it sequentially to writedata 
    for (var i = 0; i < data.length; i++)
    {    
        writeData += data[i].product_code + "," + data[i].quantity
        + "," + data[i].pick_location.letter + " " +
        data[i].pick_location.number + "\r\n"
    }
    //write to a file called output.csv
    fs.writeFileSync('output.csv', writeData);
    console.log("File Saved!");
}