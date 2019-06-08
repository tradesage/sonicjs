$(document).ready(function () {
    setupUIHovers();
    setupClickEvents();
    axiosTest();
    // SetupWYSIWYG();
});

function axiosTest() {
    console.log('running axios');
    axios.get('/api/contents')
        .then(function (response) {
            // handle success
            console.log(response);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .finally(function () {
            // always executed
            console.log('done axios');

        });
}

function setupUIHovers() {
    console.log('hover setup');

    $(".pb-section").on({
        mouseenter: function () {
            let sectionId = $(this).data('id');
            $(`section[id='${sectionId}']`).addClass('section-highlight');
        },
        mouseleave: function () {
            let sectionId = $(this).data('id');
            $(`section[id='${sectionId}']`).removeClass('section-highlight');
        }
    });

    $(".mini-layout .pb-row").on({
        mouseenter: function () {
            let sectionId = $(this).closest('.pb-section').data('id');
            let rowIndex = $(this).index();
            $(`section[id='${sectionId}'] .row:nth-child(${rowIndex})`).addClass('row-highlight');
        },
        mouseleave: function () {
            let sectionId = $(this).closest('.pb-section').data('id');
            let rowIndex = $(this).index();
            $(`section[id='${sectionId}'] .row:nth-child(${rowIndex})`).removeClass('row-highlight');
        }
    });

}

async function setupClickEvents() {
    //add section
    // $('.add-section').on("click", async function () {
    //     await addSection();
    // });
}

async function addSection() {

    console.log('adding section');
    let row = generateNewRow();
    //rows
    let rows = [row];

    //section
    let nextSectionCount = 1;
    // if (this.page.data.layout) {
    //   nextSectionCount = this.page.data.layout.length + 1;
    // }

    // let section = { title: `Section ${nextSectionCount}`, contentType: 'section', rows: rows };
    // let s1 = await createContentInstance(section);

    // //add to current page
    // if (!this.page.data.layout) {
    //   this.page.data.layout = []
    // }
    // this.page.data.layout.push(s1.id);

    // // this.contentService.editPage(this.page);
    // let updatedPage = await editContentInstance(this.page);


    //update ui
    // this.fullPageUpdate();
    // this.loadSections(updatedPage);
    //this.refreshPage(updatedPage);
}

async function generateNewRow() {

    let col = await generateNewColumn();

    let row = { class: 'row', columns: [col] }

    return row;
}

async function generateNewColumn() {
    let block1 = { contentType: 'block', body: '<p>Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>' };

    //save blocks and get the ids
    let b1 = await createContentInstance(block1);
    debugger;
    let b1ShortCode = `[BLOCK id="${b1.id}"/]`;

    //columns
    let col = { class: 'col', content: `${b1ShortCode}` }
    return col;
}

createContentInstance2 = async () => {
    let res = await axios.get("https://reqres.in/api/users?page=1");
    let { data } = await res.data;
    this.setState({ users: data });
};

async function createContentInstance(payload) {
    console.log('createContentInstance payload', payload);
    let content = {};
    content.data = {};
    this.processContentFields(payload, content);
    console.log('content', content);
    // return this.http.post("/api/contents/", content).toPromise();
    return axios.post('/api/contents/', content)
        .then(async function (response) {
            console.log(response);
            return await response.data;
        })
        .catch(function (error) {
            console.log(error);
        });

}

function editContentInstance(payload) {
    let id = payload.id;
    console.log('putting payload', payload);
    // return this.http.put(environment.apiUrl + `contents/${id}`, payload).toPromise();
    axios.put(`/api/contents/${id}`, content)
        .then(function (response) {
            console.log(response);
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
}

function processContentFields(payload, content) {
    for (var property in payload) {
        if (payload.hasOwnProperty(property)) {
            if (property == 'url' || property == 'id') {
                content.url = payload.url;
                continue;
            }
            content.data[property] = payload[property];
        }
    }
}


function setupWYSIWYG() {
    console.log('WYSIWYG setup');
    tinymce.remove(); //remove previous editor
    // tinymce.baseURL = '/tinymce/';
    // console.log('tinymce.base_url',tinymce.baseURL);
    //plugins: 'print preview fullpage powerpaste searchreplace autolink directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount tinymcespellchecker a11ychecker imagetools textpattern help formatpainter permanentpen pageembed tinycomments mentions linkchecker',

    $('textarea.wysiwyg-content').tinymce({
        selector: '#block-content',
        height: 600,
        plugins: 'image imagetools',
        toolbar: 'formatselect | bold italic strikethrough forecolor backcolor permanentpen formatpainter | link image media pageembed | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent | removeformat | addcomment',
        image_advtab: false,
        image_list: [
            { title: 'My image 1', value: 'https://www.tinymce.com/my1.gif' },
            { title: 'My image 2', value: 'http://www.moxiecode.com/my2.gif' }
        ],
        // images_upload_url: 'http://localhost:3000/api/containers/container1/upload',
        automatic_uploads: true,
        images_upload_handler: function (blobInfo, success, failure) {
            var xhr, formData;

            xhr = new XMLHttpRequest();
            xhr.withCredentials = false;
            xhr.open('POST', "http://localhost:3000/api/containers/container1/upload");

            xhr.onload = function () {
                var json;

                if (xhr.status != 200) {
                    failure("HTTP Error: " + xhr.status);
                    return;
                }

                json = JSON.parse(xhr.responseText);
                var file = json.result.files.file[0];
                var location = `http://localhost:3000/api/containers/${file.container}/download/${file.name}`;
                if (!location) {
                    failure("Invalid JSON: " + xhr.responseText);
                    return;
                }

                success(location);
            };

            formData = new FormData();
            formData.append('file', blobInfo.blob(), blobInfo.filename());

            xhr.send(formData);
        }
    });
}