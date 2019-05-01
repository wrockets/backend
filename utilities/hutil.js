module.exports = {
    // return elements of an array in a string, side by side, separated by ', '
    printarrayh(arr){
        output = ''
        var i
        for(i=0, l=arr.length; i<l; i++){
            output += arr[i] + ', '
        }
        return output.slice(0, -2)
    },
    /**
     * 
     * @param {*} obj checks if a given object is empty (doesn't have any keys nor values)
     */
    isEmpty(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
}