/**
 * Upload widget for cloudinary API
 */

const { cloudinary } = window;

function showUploadWidget(folderName) {
  cloudinary.openUploadWidget(
    {
      cloudName: 'pantree',
      apiKey: '189571722787184',
      uploadPreset: 'pantree',
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
        palette: {
          window: '#FFFFFF',
          windowBorder: '#DBDBDB',
          tabIcon: '#3273DC',
          menuIcons: '#3273DC',
          textDark: '#38373A',
          textLight: '#FFFFFF',
          link: '#3273DC',
          action: '#3273DC',
          inactiveTabIcon: '#38373A',
          error: '#F04770',
          inProgress: '#3273DC',
          complete: '#4FC9CE',
          sourceBg: '#FDFDFD',
        },
        fonts: {
          "'Lato', sans-serif":
            'https://fonts.googleapis.com/css2?family=Lato&display=swap',
        },
      },
    },
    (err, res) => {
      if (!err && res && res.event === 'success') {
        // TODO: CODE TO ADD URL VALUE (FROM JSON OBJECT) TO HIDDEN INPUT AS PART OF FORM SHOULD GO HERE
        // name="photo" << hidden field that needs adding to form view
        console.log(res.info);
      }
    }
  );
}

const donationUploadBtn = document.querySelector('#donationUploadBtn');

donationUploadBtn.addEventListener('click', () =>
  showUploadWidget('donations')
);
