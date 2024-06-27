const xhr = new XMLHttpRequest();


//async code - need to wait for response through internet from backend, which wil show undefined first.
//to avoid that, addEventListeners is used
xhr.addEventListener('load', () => {
 console.log(xhr.response);
});

xhr.open('GET', 'https://supersimplebackend.dev');
xhr.send();
