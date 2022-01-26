$(document).ready(function(){var bootstrap_cards_object={category_names:{},per_page:50,categories_to_be_excluded:"0",date_options:{year:"numeric",month:"long",day:"numeric"},current_offset:0,empty_items_container:function(t){$(".bootstrap_cards_items_container").empty()},empty_load_more_button_container:function(t){$(".bootstrap_cards_load_more_button_container").empty()},toggle_spinner:function(t){$(".bootstrap_cards_spinner").toggle()},add_spinner:function(t){bootstrap_cards_object.empty_items_container(),$(".bootstrap_cards_items_container").append(`
      <div class="text-center my-3">
        <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
      </div>
      `)},add_load_more_button:function(t){bootstrap_cards_object.empty_load_more_button_container(),$(".bootstrap_cards_load_more_button_container").append(`
      <button type="button" class="bootstrap_cards_load_more_button my-4" data-category-id="${t}">Mehr</button>
      `),$(".bootstrap_cards_load_more_button").on("click",function(){bootstrap_cards_object.get_and_append_items($(this).data("category-id"))})},add_listeners_for_category_buttons:function(t){$(".bootstrap_cards_category_button").on("click",function(){bootstrap_cards_object.get_and_place_items($(this).data("category-id")),$(".bootstrap_cards_category_button").removeClass("disabled"),$(this).toggleClass("disabled")})},get_image_url:function(t){var e,a="";return void 0===t._embedded||void 0===t._embedded["wp:featuredmedia"]||void 0===t._embedded["wp:featuredmedia"][0]||(void 0!==(e=t._embedded["wp:featuredmedia"][0].media_details.sizes).medium_large?a=e.medium_large.source_url:void 0!==e.large?a=e.large.source_url:void 0!==e.medium?a=e.medium.source_url:void 0!==e.full&&(a=e.full.source_url)),a=""===a?void 0===t.yoast_head_json||void 0===t.yoast_head_json.og_image||void 0===t.yoast_head_json.og_image[0]?"https://i.picsum.photos/id/287/300/200.jpg?hmac=eVf6BLO211WaBRmmt-cOiXLvrDaqS7nqHAIVHR4YiUQ":t.yoast_head_json.og_image[0].url:a},append_item:function(t){var e=bootstrap_cards_object.get_image_url(t);$(".bootstrap_cards_items_container").append(`
    <div class="col">
      <div class="card h-100 bootstrap-cards-card">
      <img src="${e}" class="card-img-top" style="width: 100%; height: 300px; object-fit: cover;">
        <div class="card-body">
          <h2 class="text-center bootstrap_cards_title">${t.title.rendered}</h2>
          <p class="card-text bootstrap_cards_content">${bootstrap_cards_object.truncate(t.content.rendered.replace(/(<([^>]+)>)/gi," ").replace(/\n|\r|\t/g,""),25)}</p>
          <p class="text-center">
            <a href="${t.link}" class="bootstrap_cards_href stretched-link">Weiterlesen »</a>
          </p>
        </div>
        <div class="card-footer bg-white text-center bootstrap_cards_footer">
          ${new Date(t.date).toLocaleDateString("de-DE",bootstrap_cards_object.date_options)}
        </div>
      </div>
    </div>
      `)},append_item_with_tag:function(t){var e=bootstrap_cards_object.get_image_url(t);$(".bootstrap_cards_items_container").append(`
    <div class="col">
      <div class="card h-100 bootstrap-cards-card">
      <img src="${e}" class="card-img-top" style="width: 100%; height: 300px; object-fit: cover;">
        <div class="card-body">
        <span class="bootstrap_cards_pill">
            ${bootstrap_cards_object.category_names[t.categories[0]]}
          </span>

          <h2 class="text-center bootstrap_cards_title">${t.title.rendered}</h2>
          <p class="card-text bootstrap_cards_content">${bootstrap_cards_object.truncate(t.content.rendered.replace(/(<([^>]+)>)/gi," ").replace(/\n|\r|\t/g,""),25)}</p>
          <p class="text-center">
            <a href="${t.link}" class="bootstrap_cards_href stretched-link">Weiterlesen »</a>
          </p>
        </div>
        <div class="card-footer bg-white text-center bootstrap_cards_footer">
          ${new Date(t.date).toLocaleDateString("de-DE",bootstrap_cards_object.date_options)}
        </div>
      </div>
    </div>
      `)},get_and_append_items:function(a){bootstrap_cards_object.current_offset=bootstrap_cards_object.current_offset+bootstrap_cards_object.per_page;var t={per_page:bootstrap_cards_object.per_page,offset:bootstrap_cards_object.current_offset};"all"==a||(t.categories=a),$.ajax({method:"GET",url:window.location.origin+"/wp-json/wp/v2/posts?_embed",data:t}).done(function(t){if("all"==a)for(var e=0;e<t.length;e++)bootstrap_cards_object.append_item_with_tag(t[e]);else for(e=0;e<t.length;e++)bootstrap_cards_object.append_item(t[e]);bootstrap_cards_object.empty_load_more_button_container(),t.length>=bootstrap_cards_object.per_page&&bootstrap_cards_object.add_load_more_button(a)})},get_and_place_items:function(a){bootstrap_cards_object.toggle_spinner(),bootstrap_cards_object.empty_items_container(),bootstrap_cards_object.empty_load_more_button_container(),bootstrap_cards_object.current_offset=0;var t={per_page:bootstrap_cards_object.per_page};"all"==a||(t.categories=a),$.ajax({method:"GET",url:window.location.origin+"/wp-json/wp/v2/posts?_embed",data:t}).done(function(t){if(bootstrap_cards_object.toggle_spinner(),bootstrap_cards_object.empty_items_container(),"all"==a)for(var e=0;e<t.length;e++)bootstrap_cards_object.append_item_with_tag(t[e]);else for(e=0;e<t.length;e++)bootstrap_cards_object.append_item(t[e]);t.length>=bootstrap_cards_object.per_page?bootstrap_cards_object.add_load_more_button(a):bootstrap_cards_object.empty_load_more_button_container()})},get_and_place_categories:function(t){$.ajax({method:"GET",url:window.location.origin+"/wp-json/wp/v2/categories",data:{exclude:bootstrap_cards_object.categories_to_be_excluded}}).done(function(t){$(".bootstrap_cards_buttons_container").empty(),$(".bootstrap_cards_buttons_container").append(`
        <button type="button" class="bootstrap_cards_category_button bootstrap_cards_category_button_all mb-4" data-category-id="all">Alle anzeigen</button>
        `);for(var e=0;e<t.length;e++)bootstrap_cards_object.category_names[t[e].id]=t[e].name,$(".bootstrap_cards_buttons_container").append(`
          <button type="button" class="bootstrap_cards_category_button my-2" data-category-id=${t[e].id}>${t[e].name}</button>
          `);bootstrap_cards_object.add_listeners_for_category_buttons()})},truncate:function(t,e){var a=t.trim().split(" "),t=a.filter(function(t){return t}),a=a.length>e?"...":"";return t.slice(0,e).join(" ")+a}};bootstrap_cards_object.categories_to_be_excluded=$(".bootstrap_cards_container").data("categories-to-be-excluded"),bootstrap_cards_object.per_page=$(".bootstrap_cards_container").data("per-page"),bootstrap_cards_object.get_and_place_categories(),bootstrap_cards_object.get_and_place_items("all")});