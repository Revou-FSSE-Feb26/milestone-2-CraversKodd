// mengambil elemen dropdown dan tombolnya
const dropdownWrapper = document.querySelector('.dropdown');
const dropbtn = document.querySelector('.dropbtn');

// triger saat di klik
dropbtn.addEventListener('click', (event) => {
    // ini untuk mencegah halaman loncat
    event.preventDefault(); 
    
    // memanggil fungsi toggle dropdown
    dropdownWrapper.classList.toggle('is-open');
});