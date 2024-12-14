function dateformater(inputdate) {    
  const date = new Date(inputdate);


  const formattedDate = date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return formattedDate;

}

export default dateformater;


