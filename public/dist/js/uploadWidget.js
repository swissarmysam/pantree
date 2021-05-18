/**
 * Upload widget for cloudinary API
 */

const { cloudinary } = window;

function showUploadWidget(folderName) {
  cloudinary.openUploadWidget(
    {
      cloudName: 'pantree',
      apiKey: '189571722787184',
      uploadPreset: 'preset1',
      sources: ['local', 'camera', 'url'],
      multiple: false,
      maxFiles: 1,
      folder: folderName,
      resourceType: 'image',
      fieldName: 'photo',
      theme: 'minimal',
      language: 'en',
      text: {
        en: {
          queue: {
            title: 'Uploading your image',
          },
        },
      },
      styles: {
        fonts: {
          "'Lato', sans-serif":
            'https://fonts.googleapis.com/css2?family=Lato&display=swap',
        },
      },
    },
    (err, res) => {
      if (!err && res && res.event === 'success') {
        console.log(res.info);
      }
    }
  );
}

const donationUploadBtn = document.querySelector('#donationUploadBtn');

donationUploadBtn.addEventListener('click', () =>
  showUploadWidget('donations')
);
