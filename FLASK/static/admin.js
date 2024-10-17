$(document).ready(function() {
    console.log("Document is ready");

    $('#courseForm_Admission').on('submit', function(event) {
        event.preventDefault();
        console.log("Form submitted");

        $.ajax({
            url: '/get_admin_data',
            method: 'POST',
            data: $(this).serialize(),
            beforeSend: function() {
                console.log("Sending AJAX request");
            },
            success: function(response) {
                console.log("Received response", response);
                
            },
            error: function(xhr, status, error) {
                console.error("AJAX request failed", status, error);
            }
        });
    });
});