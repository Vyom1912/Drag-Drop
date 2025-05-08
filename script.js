let lists = document.getElementsByClassName("list");
let rightBox = document.getElementById("right");
let leftBox = document.getElementById("left");

for (list of lists) {
  list.addEventListener("dragstart", (e) => {
    let selected = e.target;

    rightBox.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    rightBox.addEventListener("drop", (e) => {
      rightBox.appendChild(selected);
      selected = null;
    });

    leftBox.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    leftBox.addEventListener("drop", (e) => {
      leftBox.appendChild(selected);
      selected = null;
    });
  });
}
// ------------------------------------------------------------------------------------
const dropArea = document.getElementById("dropArea");
const filePreview = document.getElementById("filePreview");
const downloadLink = document.getElementById("downloadLink");

dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.classList.add("hover");
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("hover");
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.classList.remove("hover");
  const files = e.dataTransfer.files;
  filePreview.innerHTML = "";
  downloadLink.style.display = "none";

  if (files.length > 0) {
    Array.from(files).forEach((file, index) => {
      const fileDiv = document.createElement("div");
      fileDiv.className = "file-item";
      fileDiv.innerHTML = `<strong>${file.name}</strong>`;

      const reader = new FileReader();

      if (file.type.startsWith("image/")) {
        reader.onload = (event) => {
          fileDiv.innerHTML += `<img src="${event.target.result}" alt="${file.name}">`;

          if (index === 0) {
            downloadLink.href = event.target.result;
            downloadLink.download = file.name;
            downloadLink.style.display = "inline-block";
          }
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith("text/")) {
        reader.onload = (event) => {
          fileDiv.innerHTML += `<pre>${event.target.result}</pre>`;

          if (index === 0) {
            const blob = new Blob([event.target.result], {
              type: file.type,
            });
            const url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = file.name;
            downloadLink.style.display = "inline-block";
          }
        };
        reader.readAsText(file);
      } else {
        // For non-previewable files (e.g., zip, PDF, etc.)
        const blobURL = URL.createObjectURL(file);
        fileDiv.innerHTML += `<p>Preview not available. Type: ${
          file.type || "unknown"
        }</p>`;

        if (index === 0) {
          downloadLink.href = blobURL;
          downloadLink.download = file.name;
          downloadLink.style.display = "inline-block";
        }
      }

      filePreview.appendChild(fileDiv);
    });
  } else {
    filePreview.innerHTML = `<p>No files detected.</p>`;
  }
});
