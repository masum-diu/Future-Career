  $(document).ready(function() {
      // Get career ID from URL
      const urlParams = new URLSearchParams(window.location.search);
      const careerId = urlParams.get('id');
      
      if (!careerId) {
        window.location.href = 'index.html';
        return;
      }

      // Show loading spinner
      $('.loading-spinner').show();
      $('#careerDetails').hide();

      // Fetch career details
      $.ajax({
        url: `https://www.ehlcrm.theskyroute.com/api/future-career-details?id=${careerId}`,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
          $('.loading-spinner').hide();
          $('#careerDetails').show();

          if (data) {
            // Populate basic info
            $('#careerTitle').text(data.name || 'Career Details');
            $('#careerTagline').text(data.overview ? data.overview.substring(0, 120) + '...' : 'A promising career path');
            $('#careerOverview').text(data.overview || 'No overview available.');
            
            // Set image
            const imageUrl = data.image ? `https://www.ehlcrm.theskyroute.com${data.image}` : getDefaultImage(data.course_department_id);
            $('#careerImage').attr('src', imageUrl).attr('alt', data.name);

            // Populate "Why This Career"
            if (data.why_this) {
              const whyThisPoints = data.why_this.split(';').filter(point => point.trim() !== '');
              whyThisPoints.forEach(point => {
                $('#careerWhyThis').append(`<div class="requirement-item">${point.trim()}</div>`);
              });
            } else {
              $('#careerWhyThis').html('<p class="text-muted">No information available.</p>');
            }

            // Populate requirements
            if (data.requirement) {
              const requirements = data.requirement.split(';').filter(req => req.trim() !== '');
              requirements.forEach(req => {
                $('#careerRequirements').append(`<div class="requirement-item">${req.trim()}</div>`);
              });
            } else {
              $('#careerRequirements').html('<p class="text-muted">No specific requirements listed.</p>');
            }

            // Populate quick facts
            $('#careerDepartment').text(getDepartmentName(data.course_department_id));
            $('#careerPopular').text(data.is_popular ? 'Yes' : 'No');
            
            // Update page title
            document.title = `${data.name} | Future Careers`;
          } else {
            $('#careerDetails').html(`
              <div class="container my-5">
                <div class="alert alert-danger">
                  <h4>Career not found</h4>
                  <p>The requested career could not be loaded.</p>
                  <a href="index.html" class="btn btn-primary">Back to Careers</a>
                </div>
              </div>
            `);
          }
        },
        error: function(xhr, status, error) {
          $('.loading-spinner').hide();
          $('#careerDetails').html(`
            <div class="container my-5">
              <div class="alert alert-danger">
                <h4>Error loading career</h4>
                <p>${error}</p>
                <button class="btn btn-primary" onclick="location.reload()">Try Again</button>
                <a href="index.html" class="btn btn-secondary">Back to Careers</a>
              </div>
            </div>
          `);
        }
      });

      // Get default image based on department
      function getDefaultImage(departmentId) {
        const defaultImages = {
          1: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          4: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          7: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          9: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          11: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          13: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          14: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          16: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        };
        return defaultImages[departmentId] || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80';
      }

      // Get department name
      function getDepartmentName(departmentId) {
        const departments = {
          1: 'Finance',
          4: 'Architecture',
          7: 'Marketing',
          9: 'Engineering',
          11: 'Medical',
          13: 'Research',
          14: 'Technology',
          16: 'Law'
        };
        return departments[departmentId] || 'General';
      }
    });