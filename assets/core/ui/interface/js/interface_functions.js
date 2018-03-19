/*
  Texpansion
  (c)2018 Trevor D. Brown.

  interface_functions.js - provides the UI functionalty.
*/

var snippets_file = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': "/texpansion/getallsnippets",
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });

    for (var i = 0; i < json.length; i++){
      json[i].options = "<input id=\"edit_" + json[i].id + "\" class=\"option_controls\" type=\"button\" value=\"Edit\" \/><br \/><input id=\"remove_" + json[i].id + "\" class=\"option_controls\" type=\"button\" value=\"Remove\" \/>";
    }
    //console.log(json);
    return json;
})();

window.onload = function(){
  var toggle_update_timer = setInterval(updateToggleStatus, 100);

  function updateToggleStatus(){
    var toggleStatusField = document.getElementById('toggleStatus');
    var toggleStatus = null;

    $.ajax({
        'async': false,
        'global': false,
        'url': "/texpansion/gettogglestatus",
        'dataType': "text",
        'success': function (data) {
            toggleStatus = data;
        }
    });

    if (toggleStatus == "true"){
      toggleStatusField.textContent = "Toggle Status: Listening for input...";
    }
    else {
      toggleStatusField.textContent = "Toggle Status: Off"
    }
  }

  $(credits).on('click',function(event){
    alert("Credits \(Packages Used\):\nNode.js \(https://nodejs.org/en/\)\nExpress.js \(https://www.npmjs.com/package/express, https://github.com/expressjs/express\)\nIOHook \(https://www.npmjs.com/package/iohook, https://github.com/WilixLead/iohook\)\nRobot.js \(http://robotjs.io/, https://www.npmjs.com/package/robotjs, https://github.com/octalmage/robotjs\)\nOpn \(https://www.npmjs.com/package/opn, https://github.com/sindresorhus/opn\)");
  });

  buildTable();

  // Dynamic Option Controls Event Handler Generation
  $("#snippets_table").on('click', '.option_controls', function(event) {
    if(event.target.id.substring(0,1) == "r"){
      var snippet_id = event.target.id.substring(7, event.target.id.length);
      var delete_prompt = confirm("Are you sure you want to remove \"" + snippet_id + "\"?");

      if (delete_prompt == true){
        event.preventDefault();
        var data = {};
        data.id = snippet_id;
        $.ajax({
            url:'/texpansion/removesnippet',
            type:'POST',
            data: data,
            dataType: 'application/json'
        });
        location.reload();
      }

    }
    else if (event.target.id.substring(0,1) == "e"){
      var snippet_id = event.target.id.substring(5, event.target.id.length);

      $("#snippet_id").val(snippet_id);

      event.preventDefault();
      var data = {};
      data.id = snippet_id;

      $.ajax({
         'async': false,
          url:'/texpansion/getsnippet',
          type:'POST',
          data: data,
          dataType: 'html',
          success: function(data, status) {
            $("#snippet_content").val(JSON.parse(data).snippet);
          },
          error: function(status) {
             console.log("Error: Could not get snippet.");
          }
      });
    }

  });

  // Add New Snippet Button Event Handler
  $("#add_new_snippet").click(function(event){
    var snippet_id = $("#snippet_id").val();
    var snippet_content = $("#snippet_content").val();

    if ((snippet_id != "") && (snippet_content != "")){
      var snippet_exists;
      doesSnippetExist(snippet_id, function(result){snippet_exists = (result == "true");});

      if (snippet_exists == false){
        var snippet_added;
        addNewSnippet(snippet_id, snippet_content, function(result){snippet_added = result;});

        if (snippet_added == true){
          location.reload();
        }
      }
      else if (snippet_exists == true){
        var update_snippet = confirm("Are you sure you want to update " + snippet_id + "?");

        if (update_snippet == true){
          var snippet_updated;
          updateSnippet(snippet_id, snippet_content, function(result){snippet_updated = result;});

          if (snippet_updated == true){
            location.reload();
          }
        }
      }
    }
  });

  // Tab Support in Textarea element
  HTMLTextAreaElement.prototype.getCaretPosition = function () { //return the caret position of the textarea
      return this.selectionStart;
  };
  HTMLTextAreaElement.prototype.setCaretPosition = function (position) { //change the caret position of the textarea
      this.selectionStart = position;
      this.selectionEnd = position;
      this.focus();
  };
  HTMLTextAreaElement.prototype.hasSelection = function () { //if the textarea has selection then return true
      if (this.selectionStart == this.selectionEnd) {
          return false;
      } else {
          return true;
      }
  };
  HTMLTextAreaElement.prototype.getSelectedText = function () { //return the selection text
      return this.value.substring(this.selectionStart, this.selectionEnd);
  };
  HTMLTextAreaElement.prototype.setSelection = function (start, end) { //change the selection area of the textarea
      this.selectionStart = start;
      this.selectionEnd = end;
      this.focus();
  };

  var textarea = document.getElementsByTagName('textarea')[0];

  textarea.onkeydown = function(event) {

      //support tab on textarea
      if (event.keyCode == 9) { //tab was pressed
          var newCaretPosition;
          newCaretPosition = textarea.getCaretPosition() + "    ".length;
          textarea.value = textarea.value.substring(0, textarea.getCaretPosition()) + "    " + textarea.value.substring(textarea.getCaretPosition(), textarea.value.length);
          textarea.setCaretPosition(newCaretPosition);
          return false;
      }
      if(event.keyCode == 8){ //backspace
          if (textarea.value.substring(textarea.getCaretPosition() - 4, textarea.getCaretPosition()) == "    ") { //it's a tab space
              var newCaretPosition;
              newCaretPosition = textarea.getCaretPosition() - 3;
              textarea.value = textarea.value.substring(0, textarea.getCaretPosition() - 3) + textarea.value.substring(textarea.getCaretPosition(), textarea.value.length);
              textarea.setCaretPosition(newCaretPosition);
          }
      }
      if(event.keyCode == 37){ //left arrow
          var newCaretPosition;
          if (textarea.value.substring(textarea.getCaretPosition() - 4, textarea.getCaretPosition()) == "    ") { //it's a tab space
              newCaretPosition = textarea.getCaretPosition() - 3;
              textarea.setCaretPosition(newCaretPosition);
          }
      }
      if(event.keyCode == 39){ //right arrow
          var newCaretPosition;
          if (textarea.value.substring(textarea.getCaretPosition() + 4, textarea.getCaretPosition()) == "    ") { //it's a tab space
              newCaretPosition = textarea.getCaretPosition() + 3;
              textarea.setCaretPosition(newCaretPosition);
          }
      }
  }

};

function isSnippetsFileEmpty(){
  if (snippets_file.length > 0){
    return false;
  }
  else{
    return true;
  }
}

function buildTable(){
  var element = document.getElementById("all_snippets");

  var snippets_table = "\<table class=\"display\" id=\"snippets_table\">";
  snippets_table += "\<thead\>";
  snippets_table += "\<tr\>";
  snippets_table += "\<th\>ID\</th\>";
  snippets_table += "\<th\>Content\</th\>";
  snippets_table += "\<th\>Options\</th\>";
  snippets_table += "\</tr\>";
  snippets_table += "\</thead\>";
  snippets_table += "\</table\>";

  if (isSnippetsFileEmpty() == false){
    element.insertAdjacentHTML('beforeend', snippets_table);
    populateTable();
  }
  else {
    element.innerHTML = "<p>No snippets!</p>";
  }

}

function populateTable(){
  $('#snippets_table').DataTable({
    "data" : snippets_file,
    "columns" : [
         {
           "data": "id",
           "render": $.fn.dataTable.render.text()
          },
         {
           "data": "content",
           "render": $.fn.dataTable.render.text()
         },
         {
           "data": "options",
         }
     ]
  });
}

function doesSnippetExist(snippet_id, result){
  event.preventDefault();
  var data = {};
  data.id = snippet_id;
  $.ajax({
      'async': false,
      url:'/texpansion/doessnippetexist',
      type:'POST',
      data: data,
      dataType: 'html',
      success: function(data, status) {
        result(JSON.parse(data).exists);
      },
      error: function(status) {
        result(null);
      }
  });
}

function addNewSnippet(snippet_id, snippet_content, result){
  event.preventDefault();
  var data = {};
  data.id = snippet_id;
  data.content = snippet_content;
  $.ajax({
      'async': false,
      url:'/texpansion/addsnippet',
      type:'POST',
      data: data,
      dataType: 'html',
      success: function(status) {
         result(true);
      }
    });
}

function updateSnippet(snippet_id, snippet_content, result){
  event.preventDefault();
  var data = {};
  data.id = snippet_id;
  data.content = snippet_content;
  $.ajax({
      'async': false,
      url:'/texpansion/updatesnippet',
      type:'POST',
      data: data,
      dataType: 'html',
      success: function(status) {
         result(true);
      }
    });
}
