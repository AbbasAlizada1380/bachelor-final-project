import React from 'react';
import html2pdf from 'html2pdf.js';

const DownloadPdfComponent = () => {
  const handleDownload = () => {
    const element = document.getElementById('contentToConvert');
    const options = {
      margin:       0.5,
      filename:     'document.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(options).from(element).save();
  };

  return (
    <div className="container mx-auto p-4">
      <div id="contentToConvert" className="bg-white p-4 rounded-lg shadow-md">
      <div class="bg-white p-8 rounded shadow-lg max-w-2xl w-full">
        <div class="text-center mb-4">
            <h1 class="text-2xl font-bold">درخواست نکاح</h1>
            <p class="mt-2">شهرت درخواست کنندگان</p>
        </div>

        <div class="text-right">
            <p>به مقام محترم محکمه وثایق شهر کابل</p>
            <p>
                ما دو نفر هر یک 
                <input type="text" class="border-b border-gray-400 focus:outline-none mx-2"/> 
                ولد 
                <input type="text" class="border-b border-gray-400 focus:outline-none mx-2"/> 
                ولدیت 
                <input type="text" class="border-b border-gray-400 focus:outline-none mx-2"/> 
                باشنده 
                <input type="text" class="border-b border-gray-400 focus:outline-none mx-2"/> 
                و 
                <input type="text" class="border-b border-gray-400 focus:outline-none mx-2"/> 
                ولد 
                <input type="text" class="border-b border-gray-400 focus:outline-none mx-2"/> 
                ولدیت 
                <input type="text" class="border-b border-gray-400 focus:outline-none mx-2"/> 
                باشنده 
                <input type="text" class="border-b border-gray-400 focus:outline-none mx-2"/> 
            </p>
            <p>
                در حال داشتن اهلیت کامل حقوقی به رضا و رغبت خود میخواهیم ازدواج نماییم، خواهشمندیم در طی مراحل و توثیق عقد نکاح ما به شعبه مربوط خویش هدایت فرمایید
            </p>
            <p>محل امضا درخواست کنندگان</p>
            <p class="mt-8">........                                           ..........</p>
        </div>

        <div class="mt-8 text-right">
            <p>فورم هذا به منظور طی مراحل به مراجع مربوط ارسال گردید</p>
            <p>محل امضا رئیس محکمه یا آمر اداره ثبت و اسناد و وثایق</p>
            <p class="mt-8">..........</p>
        </div>

        <div class="mt-8 text-right">
            <p>تصدیق اهالی گذر</p>
            <p>
                ما درخواست کنندگان معرفت کامل داریم و در ازدواج شان موانع شرعی و قانونی وجود ندارم. در صورت خلاف مسوول و جوابده میباشیم
            </p>
            <p>محل امضا و اثر انگشت سه نفر از همجواران و ملا امام مسجد</p>
            <p class="mt-8">........    ..........    ..........</p>
        </div>

        <div class="mt-8 text-right">
            <p>تصدیق وکیل گذر یا قریه‌دار</p>
            <p>از تحریر فوق اهالی و ملا امام مسجد تصدیق است</p>
            <p>محل مهر</p>
            <p class="mt-8">..........</p>
        </div>

        <div class="mt-8 text-right">
            <p>تصدیق اداره محل (ناحیه یا ولسوالی)</p>
            <p>از برحالی وکیل گذر یا قریه‌دار تصدیق است</p>
            <p>محل مهر</p>
            <p class="mt-8">..........</p>
        </div>

        <div class="mt-8 text-right">
            <p>شعبه مربوطه!</p>
            <p>نکاحنامه مطلوبه را اجرا نمایند</p>
            <p>محل امضا رئیس محکمه یا آمر اسناد و وثایق</p>
            <p class="mt-8">..........</p>
        </div>
      </div>
      <button
        onClick={handleDownload}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        دانلود به صورت PDF
      </button>
    </div>
    </div>
  );
}

export default DownloadPdfComponent;
