module.exports = {
    // return elements of an array in a string, side by side, separated by ', '
    printarrayh(arrayy){
        output = ''
        var i
        for(i=0, l=arrayy.length; i<l; i++){
            output += arrayy[i] + ', '
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
    },
    mystrify(word){
        var L = word.length;
        var i
        let output=''
        for(i=0; i<L; i++){
            if(word.charAt(i) == ' ')
                output += ' '
            else
                output += '❓'
        }
        return output
    },
    // reveals letters from the mystrified word
    unmystrify(mystrified, l, normal){
        var L = normal.length;
        var i
        let output = ''
        for(i=0; i<L; i++){
            let ctc = normal.charAt(i)
            if(l == ctc){
                output += ctc
            }
            else{
                output += mystrified.charAt(i)
            }
        }
        return output
    }
}