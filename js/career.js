
    $(document).ready(function() {
      let allCareers = [];
      let currentPage = 1;
      const careersPerPage = 12;
      let totalPages = 1;

      // Show loading spinner
      $('.loading-spinner').show();
      
      // Fetch careers from API
      function fetchCareers(page = 1) {
        $.ajax({
          url: `https://www.ehlcrm.theskyroute.com/api/test/top-future-career?page=${page}`,
          method: 'GET',
          dataType: 'json',
          success: function(data) {
            $('.loading-spinner').hide();
            
            if(data && data.rows && data.rows.data.length > 0) {
              allCareers = data.rows.data;
              totalPages = data.rows.last_page;
              currentPage = data.rows.current_page;
              
              renderCareers(allCareers);
              renderPagination();
              populateDepartments(allCareers);
            } else {
              $('#careerList').html('<div class="col-12 text-center py-5"><h4>No careers found</h4></div>');
            }
          },
          error: function(xhr, status, error) {
            $('.loading-spinner').hide();
            $('#careerList').html(`
              <div class="col-12 text-center py-5">
                <h4>Error loading careers</h4>
                <p class="text-danger">${error}</p>
                <button class="btn btn-primary" onclick="location.reload()">Try Again</button>
              </div>
            `);
          }
        });
      }

      // Render careers
      function renderCareers(careers) {
        $('#careerList').empty();
        
        const filteredCareers = careers.filter(career => career.overview); // Skip careers without overview
        
        if (filteredCareers.length === 0) {
          $('#noResults').show();
          return;
        }
        
        $('#noResults').hide();
        
        filteredCareers.forEach(career => {
          const imageUrl = career.image ? `https://www.ehlcrm.theskyroute.com${career.image}` : getDefaultImage(career.course_department_id);
          
          const cardHtml = `
            <div class="col-md-4">
              <div class="card career-card h-100">
                <div class="card-img-container">
                  <img src="${imageUrl}" class="card-img-top" alt="${career.name}">
                </div>
                <div class="card-body">
                  <h5 class="card-title">${career.name}</h5>
                  <p class="card-text">${career.overview.substring(0, 100)}...</p>
                  <div class="d-flex justify-content-between align-items-center mt-3">
                    <span class="department-badge">${getDepartmentName(career.course_department_id)}</span>
                    <a href="career-details.html?id=${career.id}" class="btn btn-sm view-btn text-white">
                      View <i class="fas fa-arrow-right ms-1"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          `;
          $('#careerList').append(cardHtml);
        });
      }

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

      // Populate department filter
      function populateDepartments(careers) {
        const departments = {};
        careers.forEach(career => {
          if (career.course_department_id) {
            departments[career.course_department_id] = getDepartmentName(career.course_department_id);
          }
        });
        
        const $select = $('#departmentFilter');
        $select.empty();
        $select.append('<option value="">All Departments</option>');
        
        Object.entries(departments).forEach(([id, name]) => {
          $select.append(`<option value="${id}">${name}</option>`);
        });
      }

      // Render pagination
      function renderPagination() {
        const $pagination = $('#paginationContainer ul');
        $pagination.empty();
        
        // Previous button
        $pagination.append(`
          <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
        `);
        
        // Always show first page
        $pagination.append(`
          <li class="page-item ${1 === currentPage ? 'active' : ''}">
            <a class="page-link" href="#" data-page="1">1</a>
          </li>
        `);
        
        // Show ellipsis if needed
        if (currentPage > 3) {
          $pagination.append('<li class="page-item disabled"><span class="page-link">...</span></li>');
        }
        
        // Show current page and neighbors
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);
        
        for (let i = startPage; i <= endPage; i++) {
          $pagination.append(`
            <li class="page-item ${i === currentPage ? 'active' : ''}">
              <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
          `);
        }
        
        // Show ellipsis if needed
        if (currentPage < totalPages - 2) {
          $pagination.append('<li class="page-item disabled"><span class="page-link">...</span></li>');
        }
        
        // Always show last page if different from first
        if (totalPages > 1) {
          $pagination.append(`
            <li class="page-item ${totalPages === currentPage ? 'active' : ''}">
              <a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a>
            </li>
          `);
        }
        
        // Next button
        $pagination.append(`
          <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        `);
      }

      // Pagination click handler
      $(document).on('click', '.page-link', function(e) {
        e.preventDefault();
        const page = $(this).data('page');
        if (page >= 1 && page <= totalPages) {
          fetchCareers(page);
          $('html, body').animate({
            scrollTop: $('#careerList').offset().top - 100
          }, 500);
        }
      });

      // Search functionality
      $('#searchInput').on('input', function() {
        filterCareers();
      });

      // Department filter
      $('#departmentFilter').change(function() {
        filterCareers();
      });

      // Reset filters
      $('#resetFilters').click(function() {
        $('#searchInput').val('');
        $('#departmentFilter').val('');
        filterCareers();
      });

      // Filter careers based on search and department
      function filterCareers() {
        const searchTerm = $('#searchInput').val().toLowerCase();
        const departmentFilter = $('#departmentFilter').val();
        
        const filteredCareers = allCareers.filter(career => {
          const matchesSearch = career.name.toLowerCase().includes(searchTerm) || 
                              (career.overview && career.overview.toLowerCase().includes(searchTerm));
          const matchesDepartment = !departmentFilter || career.course_department_id == departmentFilter;
          return matchesSearch && matchesDepartment;
        });
        
        renderCareers(filteredCareers);
        
        // Show/hide no results message
        if (filteredCareers.length === 0 || filteredCareers.every(c => !c.overview)) {
          $('#noResults').show();
        } else {
          $('#noResults').hide();
        }
      }

      // Initial fetch
      fetchCareers();
    });
