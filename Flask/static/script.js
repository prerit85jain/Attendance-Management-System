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
            }
        });
    });
});
$(document).ready(function() {
    $('#courseForm_Placement').on('submit', function(event) {
        event.preventDefault();
        $.ajax({
            url: '/get_Placement_data',
            method: 'POST',
            data: $(this).serialize(),
            success: function(response) {
                $('#predicted_placement').text(response.predicted_placement);
                $('#plot_placement').attr('src', 'data:image/png;base64,' + response.plot_url);
            }
        });
    });
});