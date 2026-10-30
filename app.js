    // 1. Data Produk (NAMA FILE GAMBAR HARUS SAMA PERSIS DENGAN DI PANEL VS CODE)
    const products = [
        { id: 1, name: "Smartphone Flagship", price: 7500000, image: "hp.jpg" },
        { id: 2, name: "Laptop Kerja Intel i7", price: 14500000, image: "Laptop.jpg" },
        { id: 3, name: "Wireless Headphone Bass", price: 1200000, image: "headphone.jpg" },
        { id: 4, name: "Mechanical Keyboard RGB", price: 850000, image: "keyboard.jpg" },
        { id: 5, name: "Mouse Gaming", price: 150000, image: "Mouse.jpg" },
        { id: 6, name: "Monitor Samsung 24 Inch", price: 5500000, image: "Monitor.jpg" },
        { id: 7, name: "Kursi Gaming", price: 2000000, image: "Kursi.jpg" },
        { id: 8, name: "PC Gaming", price: 25000000, image: "PC.jpg" },
        { id: 9, name: "Mousepad", price: 50000, image: "Mousepad.jpg" },
    ];

    // 2. State Keranjang Belanja
    let cart = JSON.parse(localStorage.getItem('ecommerce_cart')) || [];

    // 3. Render Produk ke Halaman
    const productsContainer = document.getElementById('products-container');

        function displayProducts() {
        productsContainer.innerHTML = ''; 
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            
            // [BARU] Menambahkan kotak input angka kuantitas tepat di atas tombol hijau
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Rp ${product.price.toLocaleString('id-ID')}</p>
                
                <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 12px;">
                    <label style="font-size: 0.85rem; font-weight: 600;">Jumlah:</label>
                    <input type="number" id="qty-input-${product.id}" value="1" min="1" max="99" 
                        style="width: 55px; padding: 5px; text-align: center; border: 1px solid var(--border-color); border-radius: 4px; background: var(--card-bg); color: var(--text-color);">
                </div>
                
                <button onclick="handleAddToCart(${product.id})">Tambah ke Keranjang</button>
            `;
            productsContainer.appendChild(productCard);
        });
    }

    // [BARU] Fungsi pintar untuk mengambil jumlah dari kotak input dan memasukkannya ke keranjang
    window.handleAddToCart = function(productId) {
        const qtyInput = document.getElementById(`qty-input-${productId}`);
        const quantityToAdd = parseInt(qtyInput.value);
        
        // Validasi jika pembeli mengosongkan kotak angka atau mengisi di bawah angka 1
        if (isNaN(quantityToAdd) || quantityToAdd < 1) {
            alert("Harap masukkan jumlah produk yang valid (minimal 1)!");
            qtyInput.value = 1;
            return;
        }

        const product = products.find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);
        
        if (cartItem) {
            cartItem.quantity += quantityToAdd; // Tambah kuantitas sesuai input angka
        } else {
            cart.push({ ...product, quantity: quantityToAdd }); // Masukkan barang baru sesuai input angka
        }
        
        qtyInput.value = 1; // Reset kembali kotak angka ke 1 setelah sukses masuk keranjang
        updateCart();
    }

    // 5. Fungsi Kurangi/Hapus dari Keranjang
    // 5. Fungsi Kurangi/Hapus dari Keranjang dengan Validasi Konfirmasi
    window.removeFromCart = function(productId) {
        // Cari produk berdasarkan ID di dalam keranjang
        const cartItem = cart.find(item => item.id === productId);
        
        if (cartItem) {
            // Jika jumlah barang tinggal 1, tampilkan pertanyaan konfirmasi sebelum menghapus
            if (cartItem.quantity === 1) {
                const yakinHapus = confirm(`Apakah Anda yakin ingin menghapus "${cartItem.name}" dari keranjang?`);
                
                if (yakinHapus) {
                    // Jika klik "OK", hapus produk sepenuhnya dari array keranjang
                    cart = cart.filter(item => item.id !== productId);
                } else {
                    // Jika klik "Cancel", batalkan proses pembatalan/penghapusan
                    return; 
                }
            } else {
                // Jika jumlah barang masih lebih dari 1, langsung kurangi tanpa pop-up konfirmasi
                cartItem.quantity--;
            }
        }
        
        // Perbarui tampilan keranjang dan simpan data terbaru ke LocalStorage
        updateCart();
    }


    // 5. Fungsi Update Tampilan Keranjang
    // PERBARUI FUNGSI INI DI FILE APP.JS ANDA
// PERBARUI FUNGSI INI DI FILE APP.JS ANDA
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    cartItemsContainer.innerHTML = '';
    
    let totalItems = 0;
    let totalPrice = 0;
    
    cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
        
        const li = document.createElement('li');
        li.classList.add('cart-item-layout'); 
        
        // [PERUBAHAN] Menyandingkan tombol (-) merah dan tombol (+) hijau di bagian cart-item-actions
        li.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-detail">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-qty">Kuantitas: ${item.quantity}</span>
                </div>
            </div>
            <div class="cart-item-actions">
                <span class="cart-item-subtotal">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</span>
                
            <div style="display: flex; gap: 5px; margin-top: 5px;">
                <button class="cart-btn-min" onclick="removeFromCart(${item.id})">-</button>
                <!-- Ganti onclick-nya menjadi plusCartQty seperti di bawah ini -->
                <button class="cart-btn-plus" onclick="plusCartQty(${item.id})">+</button>
            </div>

            </div>
        `;
        cartItemsContainer.appendChild(li);
    });
    
    cartCount.innerText = totalItems;
    cartTotalPrice.innerText = totalPrice.toLocaleString('id-ID');
    localStorage.setItem('ecommerce_cart', JSON.stringify(cart));
}   


// ==========================================
// LOGIKA PEMBAYARAN DAN SIMPAN NOTA (PDF)
// ==========================================

const savePdfBtn = document.getElementById('save-pdf-btn');

// 1. Logika saat Tombol "Bayar Sekarang" Diklik
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Keranjang Anda masih kosong!');
        return;
    }
    
    // Konfirmasi pembayaran sederhana
    const konfirmasiBayar = confirm('Apakah Anda yakin ingin memproses pembayaran untuk belanjaan ini?');
    
    if (konfirmasiBayar) {
        alert('🎉 PEMBAYARAN BERHASIL!\n\nSekarang Anda sudah bisa mendownload bukti transaksi dengan mengklik tombol "Simpan Nota (PDF)".');
        
        // [KUNCI SUKSES] Mengaktifkan tombol Save Nota karena pembayaran telah berhasil
        savePdfBtn.removeAttribute('disabled');
        savePdfBtn.style.backgroundColor = '#2980b9'; // Ubah warna jadi biru tanda aktif
        savePdfBtn.style.cursor = 'pointer';
    }
});

// 2. Logika saat Tombol "Simpan Nota (PDF)" Diklik (Hanya bisa ditekan setelah bayar sukses)
// PERBARUI LOGIKA TOMBOL SIMPAN NOTA (PDF) DI APP.JS ANDA
savePdfBtn.addEventListener('click', () => {
    const areaKeranjang = document.querySelector('.cart-section'); 
    const btnCheckout = document.getElementById('checkout-btn');
    const judulKeranjang = document.querySelector('.cart-section h2');
    const tombolAksiKeranjang = document.querySelectorAll('.cart-item-actions div');

    // 1. Sembunyikan tombol-tombol agar tidak mengotori nota
    btnCheckout.style.display = 'none';
    savePdfBtn.style.display = 'none';
    tombolAksiKeranjang.forEach(tombol => tombol.style.display = 'none');
    if (judulKeranjang) judulKeranjang.style.display = 'none';

    // 2. Buat Elemen Header Invoice Formal + Panggil Gambar Logo
    const invoiceHeader = document.createElement('div');
    invoiceHeader.classList.add('invoice-header-pdf');
    
    const tanggalHariIni = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    const nomorInvoice = `INV/${Date.now().toString().slice(-6)}`;

    invoiceHeader.innerHTML = `
        <table style="width: 100%; border-collapse: collapse; border: none; background: transparent; margin-bottom: 10px;">
            <tr>
                <td style="text-align: left; vertical-align: bottom; width: 60%; padding: 0; margin: 0; border: none;">
                    <div style="margin-left: -55px; margin-bottom: -25px; padding: 0;">
                        <img src="logo.png" alt="Logo GadgetShop" style="width: 240px; height: auto; display: block; padding: 0; margin: 0;">
                    </div>
                </td>
                <td style="text-align: right; vertical-align: bottom; width: 40%; padding: 0; margin: 0; border: none; padding-bottom: 5px;">
                    <div class="invoice-meta-data" style="color: #2c3e50; font-family: sans-serif; line-height: 1.2;">
                        <div class="invoice-title-text" style="font-size: 2.6rem; font-weight: 900; color: #2c3e50; margin-bottom: 8px; letter-spacing: 1px; line-height: 1;">INVOICE</div>
                        <div style="font-size: 0.95rem; color: #333;">No. Tagihan: <strong>${nomorInvoice}</strong></div>
                        <div style="font-size: 0.95rem; color: #333; margin-top: 5px;">Tanggal: ${tanggalHariIni}</div>
                    </div>
                </td>
            </tr>
        </table>
    `;

    // 3. Buat Elemen Footer Ucapan Terima Kasih
    const invoiceFooter = document.createElement('div');
    invoiceFooter.classList.add('invoice-footer-pdf');
    invoiceFooter.innerHTML = `
        <p style="font-weight: bold; margin-bottom: 5px;">Terima Kasih Telah Berbelanja di Gadget Shop!</p>
        <p>Jika Anda memiliki pertanyaan mengenai invoice ini, silakan hubungi customer service kami.</p>
    `;

    // Sisipkan komponen ke halaman
    areaKeranjang.insertBefore(invoiceHeader, areaKeranjang.firstChild);
    areaKeranjang.appendChild(invoiceFooter);
    
    // [KUNCI SUKSES 1] Aktifkan mode invoice premium dan paksa tingginya mengikuti konten
    areaKeranjang.classList.add('invoice-pdf-mode');
    areaKeranjang.style.setProperty('height', 'auto', 'important');
    areaKeranjang.style.setProperty('max-height', 'none', 'important');
    areaKeranjang.style.setProperty('overflow', 'visible', 'important');

    // 4. Konfigurasi Pembentukan File PDF
    const opsiPdf = {
        margin:       10,
        filename:     `${nomorInvoice}_GadgetShop.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
            scale: 3, 
            width: 800,
            useCORS: true, 
            logging: false 
        },
        // [KUNCI SUKSES 2] Trik pemotong halaman yang sangat agresif untuk html2pdf
        pagebreak:    { mode: ['css', 'legacy'], before: '.invoice-footer-pdf' },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Jeda 500ms agar browser selesai merender perubahan tinggi konten sebelum difoto jadi PDF
    setTimeout(() => {
        html2pdf().set(opsiPdf).from(areaKeranjang).save()
        .then(() => {
            alert('Invoice premium berhasil diunduh!');
            
            // Bersihkan dan kembalikan struktur halaman web ke kondisi semula
            invoiceHeader.remove();
            invoiceFooter.remove();
            areaKeranjang.classList.remove('invoice-pdf-mode');
            areaKeranjang.style.removeProperty('height');
            areaKeranjang.style.removeProperty('max-height');
            areaKeranjang.style.removeProperty('overflow');
            
            if (judulKeranjang) judulKeranjang.style.display = 'block';
            btnCheckout.style.display = 'block';
            savePdfBtn.style.display = 'block';
            
            // Reset isi keranjang belanja
            cart = [];
            localStorage.removeItem('ecommerce_cart');
            updateCart();
            
            // Mengunci kembali tombol download
            savePdfBtn.setAttribute('disabled', 'true');
            savePdfBtn.style.backgroundColor = '#bdc3c7';
            savePdfBtn.style.cursor = 'not-allowed';
        })
        .catch((error) => {
            console.error("Gagal merender Invoice: ", error);
            alert('Maaf, terjadi gangguan saat menyusun lembar PDF.');
            
            // Kembalikan ke kondisi normal jika gagal
            invoiceHeader.remove();
            invoiceFooter.remove();
            areaKeranjang.classList.remove('invoice-pdf-mode');
            areaKeranjang.style.removeProperty('height');
            areaKeranjang.style.removeProperty('max-height');
            areaKeranjang.style.removeProperty('overflow');
            if (judulKeranjang) judulKeranjang.style.display = 'block';
            btnCheckout.style.display = 'block';
            savePdfBtn.style.display = 'block';
            tombolAksiKeranjang.forEach(tombol => tombol.style.display = 'flex');
        });
    }, 500);
});


// ==========================================
// LOGIKA FITUR PENCARIAN (TARUH DI PALING BAWAH APP.JS)
// ==========================================

// 1. Ambil elemen input pencarian dari HTML
const searchInput = document.getElementById('search-input');

// 2. Jalankan fungsi setiap kali ada ketikan di kolom pencarian
searchInput.addEventListener('input', (e) => {
    // Ambil teks yang diketik lalu ubah jadi huruf kecil semua agar tidak sensitif huruf kapital
    const keyword = e.target.value.toLowerCase();
    
    // Filter array produk berdasarkan kecocokan nama produk dengan kata kunci
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(keyword)
    );
    
    // Bersihkan container produk terlebih dahulu
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';
    
    // Jika produk ditemukan, tampilkan hasil filter
    if (filteredProducts.length > 0) {
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Rp ${product.price.toLocaleString('id-ID')}</p>
                <button onclick="addToCart(${product.id})">Tambah ke Keranjang</button>
            `;
            productsContainer.appendChild(productCard);
        });
    } else {
        // Jika tidak ada nama produk yang cocok, tampilkan pesan error sederhana
        productsContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #7f8c8d; font-size: 1.2rem; padding: 20px;">Produk "${e.target.value}" tidak ditemukan...</p>`;
    }
});

// ==========================================
// LOGIKA FITUR DARK MODE (TARUH DI PALING BAWAH APP.JS)
// ==========================================

const darkModeToggle = document.getElementById('dark-mode-toggle');

darkModeToggle.addEventListener('click', () => {
    // 1. Pasang atau lepas kelas 'dark-theme' pada tag <body> HTML
    document.body.classList.toggle('dark-theme');
    
    // 2. Ubah icon emoji tombol secara bergantian (Matahari / Bulan)
    if (document.body.classList.contains('dark-theme')) {
        darkModeToggle.innerText = '🌙'; // Icon bulan saat mode gelap
    } else {
        darkModeToggle.innerText = '☀️'; // Icon matahari saat mode terang
    }
});

// [BARU] Fungsi untuk mengubah kuantitas langsung dari kotak input di dalam keranjang
window.changeCartQty = function(productId, newQty) {
    const qty = parseInt(newQty);
    
    // Validasi jika pengguna mengosongkan angka atau mengisi di bawah 1
    if (isNaN(qty) || qty < 1) {
        alert("Jumlah produk minimal adalah 1!");
        updateCart(); // Reset kembali tampilan ke angka valid terakhir
        return;
    }
    
    // Cari produk di keranjang lalu perbarui jumlahnya sesuai yang diketik
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity = qty;
    }
    
    // Perbarui total harga dan simpan ke LocalStorage
    updateCart();
}

// [BARU] Fungsi khusus untuk tombol (+) di dalam keranjang belanja
window.plusCartQty = function(productId) {
    // Cari produk di dalam array keranjang
    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
        cartItem.quantity++; // Naikkan kuantitas sebanyak 1
    }
    
    // Perbarui total harga, angka di keranjang, dan simpan ke LocalStorage
    updateCart();
}

// Fungsi untuk memunculkan notifikasi animasi
function showToast(message) {
    // Buat elemen baru
    const toast = document.createElement('div');
    toast.classList.add('toast-notification');
    toast.innerText = message;
    document.body.appendChild(toast);
    
    // Munculkan animasi
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Hapus otomatis setelah 2.5 detik
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}
// Pemicu utama agar semua produk dan keranjang belanja muncul saat web pertama kali dibuka
displayProducts(products);
updateCart();



