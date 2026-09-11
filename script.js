// ==================================================
// LOCAL STORAGE AYARLARI
// ==================================================

// Tarayıcının Local Storage bölümünde görevleri hangi isimle saklayacağımızı belirliyoruz.
const STORAGE_KEY = "taskflow_tasks";


// ==================================================
// HTML ELEMENTLERİNİ SEÇME
// ==================================================

// Yeni görev butonunu HTML içerisinden seçiyoruz.
const addTaskButton =
    document.getElementById("addTaskButton");

// Görevler sayfasındaki yeni görev butonunu seçiyoruz.
const addTaskButtonTasks =
    document.getElementById("addTaskButtonTasks");

// Yeni görev modalını seçiyoruz.
const taskModal =
    document.getElementById("taskModal");

// Modalı kapatacak olan X butonunu seçiyoruz.
const closeModalButton =
    document.getElementById("closeModalButton");

// Yeni görev adının yazılacağı inputu seçiyoruz.
const taskInput =
    document.getElementById("taskInput");

// Görevi kaydedecek butonu seçiyoruz.
const saveTaskButton =
    document.getElementById("saveTaskButton");

// Dashboard üzerindeki görev listesini seçiyoruz.
const taskList =
    document.getElementById("taskList");

// Tüm görevler sayfasındaki görev listesini seçiyoruz.
const allTasksList =
    document.getElementById("allTasksList");

// Görev arama inputunu seçiyoruz.
const searchInput =
    document.getElementById("searchInput");

// Görev filtreleme select elementini seçiyoruz.
const filterSelect =
    document.getElementById("filterSelect");

// Toplam görev sayısının gösterileceği HTML elementini seçiyoruz.
const totalTasks =
    document.getElementById("totalTasks");

// Tamamlanan görev sayısının gösterileceği HTML elementini seçiyoruz.
const completedTasks =
    document.getElementById("completedTasks");

// Bekleyen görev sayısının gösterileceği HTML elementini seçiyoruz.
const pendingTasks =
    document.getElementById("pendingTasks");

// Bildirim kutusunu seçiyoruz.
const toast =
    document.getElementById("toast");

// Bildirim başlığının bulunduğu elementi seçiyoruz.
const toastTitle =
    document.getElementById("toastTitle");

// Bildirim açıklamasının bulunduğu elementi seçiyoruz.
const toastMessage =
    document.getElementById("toastMessage");


// ==================================================
// SAYFA ELEMENTLERİ
// ==================================================

// Dashboard, görevler ve ayarlar bölümlerinin tamamını seçiyoruz.
const pageSections =
    document.querySelectorAll(".page-section");

// Sidebar içerisindeki bütün navigasyon butonlarını seçiyoruz.
const navItems =
    document.querySelectorAll(".nav-item");


// ==================================================
// GÖREVLERİ LOCAL STORAGE'DAN ALMA
// ==================================================

// Daha önce kaydedilmiş görevleri Local Storage'dan alıyoruz.
// JSON.parse() sayesinde kaydedilmiş JSON metnini tekrar JavaScript dizisine çeviriyoruz.
// Eğer daha önce hiç görev kaydedilmemişse boş bir dizi kullanıyoruz.
let tasks =
    JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || [];


// ==================================================
// SAYFA İLK AÇILDIĞINDA ÇALIŞACAK KODLAR
// ==================================================

// Dashboard üzerindeki görevleri ekrana basıyoruz.
renderTasks();

// Tüm görevler sayfasındaki görevleri ekrana basıyoruz.
renderAllTasks();

// İstatistiklerdeki toplam, tamamlanan ve bekleyen sayıları hesaplıyoruz.
updateStats();


// ==================================================
// GÖREVLERİ LOCAL STORAGE'A KAYDETME
// ==================================================

// Görev dizisini tarayıcıya kaydeden fonksiyonu oluşturuyoruz.
function saveTasks() {

    // JavaScript dizisini JSON metnine çevirerek Local Storage'a kaydediyoruz.
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
    );

}


// ==================================================
// YENİ GÖREV MODALINI AÇMA
// ==================================================

// Yeni görev modalını açan fonksiyonu oluşturuyoruz.
function openTaskModal() {

    // Modal elementine "show" sınıfını ekleyerek görünür hale getiriyoruz.
    taskModal.classList.add("show");

    // Modal açıldıktan kısa süre sonra inputa otomatik olarak odaklanıyoruz.
    setTimeout(function() {

        // Kullanıcının doğrudan görev yazabilmesini sağlıyoruz.
        taskInput.focus();

    }, 100);

}


// ==================================================
// YENİ GÖREV MODALINI KAPATMA
// ==================================================

// Modalı kapatan fonksiyonu oluşturuyoruz.
function closeTaskModal() {

    // Modalın "show" sınıfını kaldırarak modalı gizliyoruz.
    taskModal.classList.remove("show");

    // Modal kapatıldığında inputun içerisindeki eski yazıyı siliyoruz.
    taskInput.value = "";

}


// ==================================================
// YENİ GÖREV OLUŞTURMA
// ==================================================

// Kullanıcının girdiği bilgilerle yeni görev oluşturan fonksiyonu tanımlıyoruz.
function createTask() {

    // Input içerisindeki yazıyı alıyoruz ve başındaki/sonundaki boşlukları temizliyoruz.
    const title =
        taskInput.value.trim();


    // Kullanıcı hiçbir şey yazmadıysa görev oluşturulmasını engelliyoruz.
    if (title === "") {

        // Kullanıcıya uyarı bildirimi gösteriyoruz.
        showToast(
            "Uyarı",
            "Görev adı boş bırakılamaz."
        );

        // Kullanıcının tekrar görev yazabilmesi için inputa odaklanıyoruz.
        taskInput.focus();

        // Fonksiyonu burada durduruyoruz.
        return;

    }


    // Yeni görev için bir JavaScript nesnesi oluşturuyoruz.
    const newTask = {

        // Her görev için benzersiz olması amacıyla o anki zamanı ID olarak kullanıyoruz.
        id: Date.now(),

        // Kullanıcının yazdığı görev adını kaydediyoruz.
        title: title,

        // Yeni oluşturulan görev başlangıçta tamamlanmamış oluyor.
        completed: false

    };


    // Yeni görevi görev dizisinin en başına ekliyoruz.
    tasks.unshift(newTask);


    // Güncellenmiş görev listesini Local Storage'a kaydediyoruz.
    saveTasks();


    // Dashboard görev listesini yeniden oluşturuyoruz.
    renderTasks();

    // Tüm görevler sayfasını yeniden oluşturuyoruz.
    renderAllTasks();

    // İstatistikleri yeniden hesaplıyoruz.
    updateStats();


    // Görev oluşturulduktan sonra modalı kapatıyoruz.
    closeTaskModal();


    // Kullanıcıya görevin başarıyla oluşturulduğunu bildiriyoruz.
    showToast(
        "Görev eklendi",
        "Yeni görevin başarıyla oluşturuldu."
    );

}


// ==================================================
// DASHBOARD GÖREVLERİNİ RENDER ETME
// ==================================================

// Dashboard içerisindeki görevleri ekrana oluşturan fonksiyonu tanımlıyoruz.
function renderTasks() {

    // Önce mevcut görev listesini temizliyoruz.
    taskList.innerHTML = "";


    // Arama inputundaki yazıyı alıyoruz.
    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    // Kullanıcının seçtiği filtre değerini alıyoruz.
    const filterValue =
        filterSelect.value;


    // Görevleri arama ve filtre kriterlerine göre süzüyoruz.
    const filteredTasks =
        tasks.filter(function(task) {

            // Görev başlığının arama kelimesini içerip içermediğini kontrol ediyoruz.
            const matchesSearch =
                task.title
                    .toLowerCase()
                    .includes(searchText);


            // Başlangıçta filtre sonucunu doğru kabul ediyoruz.
            let matchesFilter = true;


            // Kullanıcı "Bekleyen" filtresini seçtiyse kontrol ediyoruz.
            if (filterValue === "pending") {

                // Sadece tamamlanmamış görevlerin geçmesine izin veriyoruz.
                matchesFilter =
                    task.completed === false;

            }


            // Kullanıcı "Tamamlanan" filtresini seçtiyse kontrol ediyoruz.
            if (filterValue === "completed") {

                // Sadece tamamlanmış görevlerin geçmesine izin veriyoruz.
                matchesFilter =
                    task.completed === true;

            }


            // Görevin hem arama hem de filtre şartını karşılayıp karşılamadığını döndürüyoruz.
            return (
                matchesSearch &&
                matchesFilter
            );

        });


    // Filtreleme sonucunda hiç görev kalmadıysa boş durum gösteriyoruz.
    if (filteredTasks.length === 0) {

        // Görev listesine "henüz görev yok" mesajını ekliyoruz.
        showEmptyState(taskList);

        // Fonksiyonu burada sonlandırıyoruz.
        return;

    }


    // Filtrelenmiş görevlerin tamamını tek tek dolaşıyoruz.
    filteredTasks.forEach(function(task) {

        // Görev nesnesinden bir HTML görev kartı oluşturuyoruz.
        const card =
            createTaskCard(task);

        // Oluşturduğumuz kartı görev listesine ekliyoruz.
        taskList.appendChild(card);

    });

}


// ==================================================
// TÜM GÖREVLERİ RENDER ETME
// ==================================================

// Tüm görevler sayfasındaki görevleri oluşturan fonksiyonu tanımlıyoruz.
function renderAllTasks() {

    // Daha önce oluşturulmuş görev kartlarını temizliyoruz.
    allTasksList.innerHTML = "";


    // Hiç görev bulunmuyorsa boş durum ekranını gösteriyoruz.
    if (tasks.length === 0) {

        // Tüm görevler alanına boş durum mesajını ekliyoruz.
        showEmptyState(allTasksList);

        // Fonksiyonu burada sonlandırıyoruz.
        return;

    }


    // Görev dizisindeki bütün görevleri tek tek dolaşıyoruz.
    tasks.forEach(function(task) {

        // Her görev için HTML kartı oluşturuyoruz.
        const card =
            createTaskCard(task);

        // Oluşturduğumuz kartı tüm görevler listesine ekliyoruz.
        allTasksList.appendChild(card);

    });

}


// ==================================================
// BOŞ GÖREV DURUMU
// ==================================================

// Görev bulunmadığında gösterilecek HTML'i oluşturan fonksiyonu tanımlıyoruz.
function showEmptyState(container) {

    // Gönderilen HTML elementinin içerisine boş durum tasarımını yerleştiriyoruz.
    container.innerHTML = `

        <!-- Görev bulunamadığında gösterilen ana boş durum alanı. -->
        <div class="empty-state">

            <!-- Boş durum ikonunun bulunduğu kutu. -->
            <div class="empty-icon">

                <!-- Boş görev durumunda tik ikonunu gösteriyoruz. -->
                ✓

            <!-- İkon kutusunu kapatıyoruz. -->
            </div>

            <!-- Kullanıcıya henüz görev olmadığını söylüyoruz. -->
            <strong>
                Henüz görev yok
            </strong>

            <!-- Kullanıcıya yeni görev oluşturmasını söylüyoruz. -->
            <p style="margin-top: 6px;">
                Yeni bir görev oluşturarak başlayabilirsin.
            </p>

        <!-- Boş durum alanını kapatıyoruz. -->
        </div>

    `;

}


// ==================================================
// GÖREV KARTI OLUŞTURMA
// ==================================================

// Bir görev nesnesinden HTML görev kartı oluşturan fonksiyonu tanımlıyoruz.
function createTaskCard(task) {

    // Yeni bir div HTML elementi oluşturuyoruz.
    const card =
        document.createElement("div");


    // Oluşturduğumuz elemente görev kartı CSS sınıfını ekliyoruz.
    card.className =
        "task-card";


    // Eğer görev tamamlanmışsa karta completed sınıfını ekliyoruz.
    if (task.completed) {

        // Tamamlanan görevlerin farklı görünmesini sağlıyoruz.
        card.classList.add(
            "completed"
        );

    }


    // Görev kartının HTML içeriğini oluşturuyoruz.
    card.innerHTML = `

        <!-- Görev bilgilerini taşıyan ana alan. -->
        <div class="task-info">

            <!-- Görevin tamamlanma durumunu gösteren checkbox. -->
            <div class="task-check">

                <!-- Görev tamamlandıysa tik gösteriyoruz. -->
                ${task.completed ? "✓" : ""}

            <!-- Checkbox alanını kapatıyoruz. -->
            </div>

            <!-- Görev başlığını ekrana yazıyoruz. -->
            <div class="task-title">

                <!-- Kullanıcının yazdığı HTML kodlarının çalışmasını engelliyoruz. -->
                ${escapeHTML(task.title)}

            <!-- Görev başlığını kapatıyoruz. -->
            </div>

        <!-- Görev bilgileri alanını kapatıyoruz. -->
        </div>


        <!-- Görev üzerinde yapılabilecek işlemlerin bulunduğu alan. -->
        <div class="task-actions">

            <!-- Görevi tamamlamak veya geri almak için kullanılan buton. -->
            <button
                class="complete-button"
                title="Görevi tamamla"
            >

                <!-- Görev durumuna göre buton yazısını değiştiriyoruz. -->
                ${task.completed
                    ? "Geri Al"
                    : "Tamamla"}

            <!-- Tamamlama butonunu kapatıyoruz. -->
            </button>


            <!-- Görevi silmek için kullanılan buton. -->
            <button
                class="delete-button"
                title="Görevi sil"
            >

                <!-- Silme butonunun yazısını gösteriyoruz. -->
                Sil

            <!-- Silme butonunu kapatıyoruz. -->
            </button>

        <!-- Görev aksiyonlarını kapatıyoruz. -->
        </div>

    `;


    // Oluşturulan kart içerisindeki tamamla butonunu seçiyoruz.
    const completeButton =
        card.querySelector(
            ".complete-button"
        );


    // Oluşturulan kart içerisindeki sil butonunu seçiyoruz.
    const deleteButton =
        card.querySelector(
            ".delete-button"
        );


    // Tamamla butonuna tıklama olayını bağlıyoruz.
    completeButton.addEventListener(
        "click",
        function() {

            // Tıklanan görevin tamamlanma durumunu değiştiriyoruz.
            toggleTask(task.id);

        }
    );


    // Sil butonuna tıklama olayını bağlıyoruz.
    deleteButton.addEventListener(
        "click",
        function() {

            // Tıklanan görevi siliyoruz ve karta animasyon uyguluyoruz.
            deleteTask(task.id, card);

        }
    );


    // Hazırladığımız görev kartını fonksiyondan geri döndürüyoruz.
    return card;

}


// ==================================================
// GÖREVİ TAMAMLAMA / GERİ ALMA
// ==================================================

// Bir görevin tamamlanma durumunu değiştiren fonksiyonu oluşturuyoruz.
function toggleTask(taskId) {

    // Görev dizisinin tamamını map() ile yeniden oluşturuyoruz.
    tasks =
        tasks.map(function(task) {

            // ID'si tıklanan görevle aynı olan görevi buluyoruz.
            if (task.id === taskId) {

                // Bulduğumuz görevin mevcut özelliklerini koruyup completed değerini tersine çeviriyoruz.
                return {

                    // Mevcut görevdeki bütün özellikleri koruyoruz.
                    ...task,

                    // true ise false, false ise true yapıyoruz.
                    completed:
                        !task.completed

                };

            }


            // Diğer görevleri hiçbir değişiklik yapmadan geri döndürüyoruz.
            return task;

        });


    // Değişen görev listesini Local Storage'a kaydediyoruz.
    saveTasks();

    // Dashboard görev listesini yeniliyoruz.
    renderTasks();

    // Tüm görevler listesini yeniliyoruz.
    renderAllTasks();

    // İstatistikleri yeniden hesaplıyoruz.
    updateStats();


    // Güncellenen görevi ID'si üzerinden buluyoruz.
    const task =
        tasks.find(function(item) {

            // ID'si eşleşen görevi geri döndürüyoruz.
            return item.id === taskId;

        });


    // Görev tamamlandıysa kullanıcıya başarı mesajı gösteriyoruz.
    if (task.completed) {

        // Görevin tamamlandığını bildiren toast gösteriyoruz.
        showToast(
            "Tebrikler 🎉",
            "Görev tamamlandı."
        );

    } else {

        // Görevin tekrar bekleyen duruma alındığını bildiriyoruz.
        showToast(
            "Görev güncellendi",
            "Görev tekrar bekleyenlere alındı."
        );

    }

}


// ==================================================
// GÖREV SİLME
// ==================================================

// Bir görevi silen fonksiyonu oluşturuyoruz.
function deleteTask(taskId, card) {

    // Silinecek karta sağa doğru hareket animasyonu uyguluyoruz.
    card.style.transform =
        "translateX(80px) scale(0.95)";

    // Silinecek kartı saydamlaştırıyoruz.
    card.style.opacity = "0";


    // Animasyonun tamamlanması için 300 milisaniye bekliyoruz.
    setTimeout(function() {

        // Silinecek görev dışındaki görevleri filtreliyoruz.
        tasks =
            tasks.filter(function(task) {

                // ID'si silinecek görevden farklı olanları tutuyoruz.
                return task.id !== taskId;

            });


        // Güncellenmiş görev listesini Local Storage'a kaydediyoruz.
        saveTasks();

        // Dashboard görev listesini güncelliyoruz.
        renderTasks();

        // Tüm görevler listesini güncelliyoruz.
        renderAllTasks();

        // İstatistikleri yeniden hesaplıyoruz.
        updateStats();


        // Kullanıcıya görevin silindiğini bildiriyoruz.
        showToast(
            "Görev silindi",
            "Görev başarıyla kaldırıldı."
        );

    }, 300);

}


// ==================================================
// İSTATİSTİKLERİ GÜNCELLEME
// ==================================================

// Dashboard üzerindeki istatistikleri hesaplayan fonksiyonu oluşturuyoruz.
function updateStats() {

    // Toplam görev sayısını hesaplıyoruz.
    const total =
        tasks.length;


    // Tamamlanan görevleri filtreleyip kaç tane olduklarını hesaplıyoruz.
    const completed =
        tasks.filter(function(task) {

            // Sadece completed değeri true olan görevleri alıyoruz.
            return task.completed;

        }).length;


    // Bekleyen görev sayısını toplam görevlerden tamamlananları çıkararak buluyoruz.
    const pending =
        total - completed;


    // Toplam görev sayısını animasyonlu şekilde ekrana yazıyoruz.
    animateNumber(
        totalTasks,
        total
    );


    // Tamamlanan görev sayısını animasyonlu şekilde ekrana yazıyoruz.
    animateNumber(
        completedTasks,
        completed
    );


    // Bekleyen görev sayısını animasyonlu şekilde ekrana yazıyoruz.
    animateNumber(
        pendingTasks,
        pending
    );

}


// ==================================================
// SAYI ANİMASYONU
// ==================================================

// İstatistik sayılarının 0'dan hedef değere doğru hareket etmesini sağlayan fonksiyonu oluşturuyoruz.
function animateNumber(element, target) {

    // Elementin mevcut yazısını sayıya çeviriyoruz.
    const current =
        Number(element.textContent) || 0;


    // Mevcut sayı hedef sayıya zaten eşitse animasyona gerek olmadığını belirtiyoruz.
    if (current === target) {

        // Fonksiyonu sonlandırıyoruz.
        return;

    }


    // Mevcut sayı ile hedef sayı arasındaki farkı hesaplıyoruz.
    const difference =
        target - current;


    // Sayı animasyonunun toplam süresini 350 milisaniye olarak belirliyoruz.
    const duration = 350;


    // Animasyonun başladığı zamanı kaydediyoruz.
    const start =
        performance.now();


    // Animasyon sırasında sayıyı güncelleyecek fonksiyonu oluşturuyoruz.
    function update(currentTime) {

        // Animasyonun ne kadar ilerlediğini 0 ile 1 arasında hesaplıyoruz.
        const progress =
            Math.min(
                (currentTime - start) / duration,
                1
            );


        // Mevcut sayıdan hedef sayıya doğru ilerleyen yeni değeri hesaplıyoruz.
        const value =
            Math.round(
                current +
                difference * progress
            );


        // Hesaplanan değeri HTML elementine yazıyoruz.
        element.textContent =
            value;


        // Animasyon henüz bitmediyse bir sonraki ekran karesinde tekrar çalıştırıyoruz.
        if (progress < 1) {

            // Tarayıcıdan bir sonraki animasyon karesini istiyoruz.
            requestAnimationFrame(update);

        }

    }


    // Sayı animasyonunu başlatıyoruz.
    requestAnimationFrame(update);

}


// ==================================================
// ARAMA
// ==================================================

// Arama inputuna yazı girildiğinde çalışacak olayı oluşturuyoruz.
searchInput.addEventListener(
    "input",
    function() {

        // Arama sonucuna göre görev listesini yeniden oluşturuyoruz.
        renderTasks();

    }
);


// ==================================================
// FİLTRE
// ==================================================

// Kullanıcı filtreyi değiştirdiğinde çalışacak olayı oluşturuyoruz.
filterSelect.addEventListener(
    "change",
    function() {

        // Seçilen filtreye göre görev listesini yeniden oluşturuyoruz.
        renderTasks();

    }
);


// ==================================================
// MODAL BUTONLARI
// ==================================================

// Dashboard'daki yeni görev butonuna modal açma olayını bağlıyoruz.
addTaskButton.addEventListener(
    "click",
    openTaskModal
);


// Görevler sayfasındaki yeni görev butonuna modal açma olayını bağlıyoruz.
addTaskButtonTasks.addEventListener(
    "click",
    openTaskModal
);


// Modal kapatma butonuna modal kapatma olayını bağlıyoruz.
closeModalButton.addEventListener(
    "click",
    closeTaskModal
);


// Görevi kaydetme butonuna görev oluşturma olayını bağlıyoruz.
saveTaskButton.addEventListener(
    "click",
    createTask
);


// ==================================================
// ENTER TUŞU İLE GÖREV EKLEME
// ==================================================

// Görev inputuna klavye olayı bağlıyoruz.
taskInput.addEventListener(
    "keydown",
    function(event) {

        // Kullanıcının bastığı tuş Enter ise kontrol ediyoruz.
        if (event.key === "Enter") {

            // Enter'a basıldığında yeni görevi oluşturuyoruz.
            createTask();

        }

    }
);


// ==================================================
// ESC TUŞU İLE MODAL KAPATMA
// ==================================================

// Tüm dokümanda klavye olaylarını dinliyoruz.
document.addEventListener(
    "keydown",
    function(event) {

        // Kullanıcı Escape tuşuna bastıysa ve modal açıksa kontrol ediyoruz.
        if (
            event.key === "Escape" &&
            taskModal.classList.contains("show")
        ) {

            // Açık olan modalı kapatıyoruz.
            closeTaskModal();

        }

    }
);


// ==================================================
// MODAL DIŞINA TIKLAYINCA KAPATMA
// ==================================================

// Modalın tamamında mouse tıklamalarını dinliyoruz.
taskModal.addEventListener(
    "click",
    function(event) {

        // Kullanıcının tıkladığı element modal arka planıysa kontrol ediyoruz.
        if (
            event.target.classList.contains(
                "modal-backdrop"
            )
        ) {

            // Modalı kapatıyoruz.
            closeTaskModal();

        }

    }
);


// ==================================================
// SAYFA GEÇİŞLERİ
// ==================================================

// Sidebar içerisindeki bütün navigasyon butonlarını tek tek dolaşıyoruz.
navItems.forEach(function(item) {

    // Her navigasyon butonuna click olayı bağlıyoruz.
    item.addEventListener(
        "click",
        function() {

            // Tıklanan butonun data-section değerini alıyoruz.
            const section =
                item.dataset.section;


            // Bütün navigasyon butonlarını dolaşıyoruz.
            navItems.forEach(
                function(nav) {

                    // Önce bütün butonlardaki active sınıfını kaldırıyoruz.
                    nav.classList.remove(
                        "active"
                    );

                }
            );


            // Tıklanan butona active sınıfını ekliyoruz.
            item.classList.add("active");


            // Sayfadaki bütün bölümleri dolaşıyoruz.
            pageSections.forEach(
                function(page) {

                    // Önce bütün sayfaları gizliyoruz.
                    page.classList.add(
                        "hidden"
                    );

                }
            );


            // Tıklanan menüye karşılık gelen sayfa elementini ID üzerinden buluyoruz.
            const targetSection =
                document.getElementById(
                    `${section}Section`
                );


            // Seçilen sayfanın hidden sınıfını kaldırarak görünür hale getiriyoruz.
            targetSection.classList.remove(
                "hidden"
            );


            // Sayfa animasyonunu sıfırlıyoruz.
            targetSection.style.animation =
                "none";


            // Tarayıcıya stil değişikliğini hemen hesaplatıyoruz.
            targetSection.offsetHeight;


            // Sayfa giriş animasyonunu tekrar başlatıyoruz.
            targetSection.style.animation =
                "pageEnter 0.55s ease both";

        }
    );

});


// ==================================================
// TOAST BİLDİRİM SİSTEMİ
// ==================================================

// Toast'ın daha önce kurulmuş zamanlayıcısını saklamak için değişken oluşturuyoruz.
let toastTimeout;


// Kullanıcıya geçici bildirim gösteren fonksiyonu oluşturuyoruz.
function showToast(title, message) {

    // Bildirim başlığını gelen title değeriyle değiştiriyoruz.
    toastTitle.textContent =
        title;

    // Bildirim açıklamasını gelen message değeriyle değiştiriyoruz.
    toastMessage.textContent =
        message;


    // Toast elementine show sınıfını ekleyerek görünür hale getiriyoruz.
    toast.classList.add("show");


    // Daha önce çalışan toast zamanlayıcısı varsa iptal ediyoruz.
    clearTimeout(toastTimeout);


    // Yeni toast kapanma zamanlayıcısı oluşturuyoruz.
    toastTimeout =
        setTimeout(function() {

            // 3 saniye sonra toastı gizliyoruz.
            toast.classList.remove(
                "show"
            );

        }, 3000);

}


// ==================================================
// HTML GÜVENLİĞİ
// ==================================================

// Kullanıcının yazdığı metnin HTML kodu olarak çalışmasını engelleyen fonksiyonu oluşturuyoruz.
function escapeHTML(text) {

    // Geçici bir div HTML elementi oluşturuyoruz.
    const div =
        document.createElement("div");


    // Kullanıcının yazdığı metni textContent olarak ekliyoruz.
// textContent kullanıldığı için yazılan HTML kodları çalıştırılmıyor.
    div.textContent =
        text;


    // Güvenli hale getirilmiş HTML metnini geri döndürüyoruz.
    return div.innerHTML;

}


// ==================================================
// MOUSE HAREKETİNE GÖRE KART EĞİMİ
// ==================================================

// Sayfadaki mouse hareketlerini dinliyoruz.
document.addEventListener(
    "mousemove",
    function(event) {

        // Mouse hareketine tepki verecek bütün tilt kartlarını seçiyoruz.
        const cards =
            document.querySelectorAll(
                ".tilt-card"
            );


        // Bulduğumuz bütün kartları tek tek dolaşıyoruz.
        cards.forEach(function(card) {

            // Kartın ekran içerisindeki konum ve boyut bilgilerini alıyoruz.
            const rect =
                card.getBoundingClientRect();


            // Kartın yatay merkez noktasını hesaplıyoruz.
            const centerX =
                rect.left +
                rect.width / 2;


            // Kartın dikey merkez noktasını hesaplıyoruz.
            const centerY =
                rect.top +
                rect.height / 2;


            // Mouse ile kartın yatay merkezi arasındaki mesafeyi hesaplıyoruz.
            const distanceX =
                event.clientX - centerX;


            // Mouse ile kartın dikey merkezi arasındaki mesafeyi hesaplıyoruz.
            const distanceY =
                event.clientY - centerY;


            // Kartın mouse hareketine tepki vereceği maksimum mesafeyi belirliyoruz.
            const maxDistance =
                350;


            // Mouse kartın yakınındaysa eğim efekti uyguluyoruz.
            if (
                Math.abs(distanceX) < maxDistance &&
                Math.abs(distanceY) < maxDistance
            ) {

                // Mouse'un dikey konumuna göre X eksenindeki dönüş açısını hesaplıyoruz.
                const rotateX =
                    -(distanceY / 35);


                // Mouse'un yatay konumuna göre Y eksenindeki dönüş açısını hesaplıyoruz.
                const rotateY =
                    distanceX / 35;


                // Kartı 3D perspektif ile mouse yönüne doğru eğiyoruz.
                card.style.transform =
                    `perspective(700px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateY(-5px)`;

            } else {

                // Mouse karttan uzaklaştığında kartın transform değerini sıfırlıyoruz.
                card.style.transform =
                    "";

            }

        });

    }
);


// ==================================================
// MANYETİK BUTON EFEKTİ
// ==================================================

// Mouse hareketine tepki verecek manyetik butonların tamamını seçiyoruz.
const magneticButtons =
    document.querySelectorAll(
        ".magnetic"
    );


// Seçtiğimiz bütün manyetik butonları tek tek dolaşıyoruz.
magneticButtons.forEach(
    function(button) {

        // Butonun içerisinde mouse hareket ettiğinde çalışacak olayı bağlıyoruz.
        button.addEventListener(
            "mousemove",
            function(event) {

                // Butonun ekran içerisindeki konum ve boyutunu alıyoruz.
                const rect =
                    button.getBoundingClientRect();


                // Mouse'un buton merkezine göre yatay uzaklığını hesaplıyoruz.
                const x =
                    event.clientX -
                    rect.left -
                    rect.width / 2;


                // Mouse'un buton merkezine göre dikey uzaklığını hesaplıyoruz.
                const y =
                    event.clientY -
                    rect.top -
                    rect.height / 2;


                // Butonu mouse yönüne doğru hafifçe hareket ettiriyoruz.
                button.style.transform =
                    `translate(
                        ${x * 0.08}px,
                        ${y * 0.08}px
                    )`;

            }
        );


        // Mouse butondan ayrıldığında çalışacak olayı bağlıyoruz.
        button.addEventListener(
            "mouseleave",
            function() {

                // Butonu normal konumuna geri döndürüyoruz.
                button.style.transform =
                    "";

            }
        );

    }
);