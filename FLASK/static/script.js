$(document).ready(function() {
    $('#courseForm_Admission').on('submit', function(event) {
        event.preventDefault();
        $.ajax({
            url: '/get_admission_data',
            method: 'POST',
            data: $(this).serialize(),
            success: function(response) {
                $('#predicted_admission').text(response.predicted_admission);
                $('#plot_admission').attr('src', 'data:image/png;base64,' + response.plot_url);

                var timelineContainer = $('#timeline-container');
                timelineContainer.empty();

                response.dict_admission.forEach(function(admission) {
                    let cardContainer = $('<div class="card-container"></div>');
                    let div1 = $('<div class="head">Number of admissions</div>')
                    cardContainer.append(div1);
                    let flag = false;
                    for (let key in admission) {
                        let value = admission[key];
                        if(flag){
                            let div2 = $('<div class="head">In the year</div>')
                            cardContainer.append(div2);
                        }
                        let div = $('<div class="value"></div>').text(value);
                        cardContainer.append(div);
                        flag = (flag)?false:true;
                    }
                    let span =  $('<span class="arrow"></span>');
                    cardContainer.append(span);
                    let span2 =  $('<span class="circle"><span class="inner-circle"></span></span>');
                    cardContainer.append(span2);
                    timelineContainer.append(cardContainer);
                });
            },
            error: function(xhr, status, error) {
                console.error("AJAX request failed", status, error);
            }
        });
    });
});
$(document).ready(function() {
    console.log("Document is ready");

    $('#courseForm_Placement').on('submit', function(event) {
        event.preventDefault();
        console.log("Form submitted");

        $.ajax({
            url: '/get_Placement_data',
            method: 'POST',
            data: $(this).serialize(),
            beforeSend: function() {
                console.log("Sending AJAX request");
            },
            success: function(response) {
                console.log("Received response", response);
                $('#predicted_placement').text(response.predicted_placement);
                $('#plot_placement').attr('src', 'data:image/png;base64,' + response.plot_url);
                
                // Update the timeline container with dict_placement data
                var timelineContainer = $('#timeline-container');
                timelineContainer.empty();  // Clear any existing content

                response.dict_placement.forEach(function(placement) {
                    var card = `<div class="card-container">
                    <div class="head">Number of Students Placed</div>
                                    <div class="value">${placement['Students Placed']}</div>
                                    <div class="head">In the year</div>
                                    <div class="value">${placement.Year}</div>
                                    <div class="arrow"></div>
                                    <div class="circle"><span class="inner-circle"></span></div>
                                </div>`;
                    timelineContainer.append(card);
                });
            },
            error: function(xhr, status, error) {
                console.error("AJAX request failed", status, error);
            }
        });
    });
});

