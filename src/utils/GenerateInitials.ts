export const GenerateInitials =(str :String)=>{
let words = str.split(" ");
let intials = ""
for(let i =0;i<words.length;i++){
    intials+= words[i].charAt(0);
}
intials = intials.substring(0,intials.length-1);
intials +=" "+ words[words.length-1];
return intials;
}