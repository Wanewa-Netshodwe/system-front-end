// Validates TUT email for both students and staff
export const isValidTUTEmail = (email: string): boolean => {
    const studentEmailPattern = /^[0-9]{9}@tut4life\.ac\.za$/;
    const staffEmailPattern = /^[0-9]{6}@tut\.ac\.za$/;
    return studentEmailPattern.test(email) || staffEmailPattern.test(email);
  };
  
  // Validates South African phone numbers: must start with 06, 07, or 08 and have 10 digits
  export const isValidSAPhoneNumber = (number: string): boolean => {
    return /^(\+27[6-8][0-9]{8}|0[6-8][0-9]{8})$/.test(number);
  };
  
  
  // Validates a TUT student number: must be exactly 9 digits
  export const isValidStudentNumber = (number: string): boolean => {
    return /^[0-9]{9}$/.test(number);
  };
  

  //const username = isValidTUTEmail("2199994@tut4life.ac.za");

  //console.log(username); // true
  //const phoneNumber = isValidSAPhoneNumber("0281234567");
    //console.log(phoneNumber); // true
    //const studentNumber = isValidStudentNumber("21999470");
    //console.log(studentNumber); // true
  