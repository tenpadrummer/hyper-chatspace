$(function(){
  var array = [];
  function searchUser(user){
    var html = `<div class="chat-group-user incremental-search-box">
                  <p class="chat-group-user__name">${user.name}</p>
                  <div class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id=${user.id} data-user-name=${user.name}>追加</div>
                </div>`
    return html;
  }

  function noUser(alert){
    var html = `<div class="chat-group-user incremental-search-box">
                  <p class="chat-group-user__name">${alert}</p>
                </div>`
    return html;
  }

  function addUser(name,id){
    var html = `<div class='chat-group-user'>
                  <input name='group[user_ids][]' type='hidden' value=${id} class="chat-group-user__selected_user">
                  <p class='chat-group-user__name'>${name}</p>
                  <div class='user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn'>削除</div>
                </div>`
    $(".chat-group-users").append(html);
  }

  function addArray() {
    $(".chat-group-user__selected_user").each(function(){
      array.push($(this).attr("value"));
    });
  }

  function removeArray() {
    var removeArray = [];
    $(".chat-group-user__selected_user").each(function(){
      removeArray.push($(this).attr("value"));
    });
    array = removeArray;
  }

  addArray();
  $(function(){
    $("#user-search-field").on("keyup", function(){
      var input = $("#user-search-field").val();
      if(input.length === 0) {
        $(".incremental-search-box").remove();
      } else {
        $.ajax({
          url: "/users",
          type: "GET",
          data: {keyword: input, selected_user: array},
          dataType: "json",
        })
        .done(function(users){
          $("#user-search-result").empty();
          if (users.length !== 0 ) {
            users.forEach(function(user){
              searchUser(user);
              var html = searchUser(user);
              $("#user-search-result").append(html);
            });
          } else {
            var html = noUser("ユーザーが見つかりません");
            $("#user-search-result").append(html);
          };
        })
        .fail(function(){
          alert("ユーザー検索に失敗しました'");
        })
      }
    })
  });

  $(function(){
    $("#user-search-result").on("click", ".chat-group-user__btn--add", function(){
      var name = $(this).attr("data-user-name");
      var id = $(this).attr("data-user-id");
      addUser(name,id);
      array.push(id);
      $(this).parent().remove();
    });

    $(".chat-group-users").on("click", ".chat-group-user__btn--remove", function(){
      $(this).parent().remove();
      removeArray();
    })
  });
});