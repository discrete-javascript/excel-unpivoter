new Vue({
  el: '#app',
  data: {
    file: null,
    excelData: [],
  },
  methods: {
    onFileChange(e) {
      if (e.target.files.length > 0) {
        this.file = e.target.files[0];
      } else {
        this.file = null;
      }
    },
    uploadFile() {
      if (!this.file) {
        alert('Please select a file to upload.');
        return;
      }

      let formData = new FormData();
      formData.append('excelFile', this.file);

      fetch('/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Server responded with ' + response.status);
          }
          return response.json();
        })
        .then((data) => {
          this.excelData = data;
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('Error: ' + error.message);
        });
    },
  },
});
