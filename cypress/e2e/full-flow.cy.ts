describe('Full User Flow', () => {
  const mockQuestions = [
    {
      id: 'ch1-q1',
      chapter: 'Chapter 1',
      text: 'What is 2+2?',
      options: [
        { key: 'A', text: '3' },
        { key: 'B', text: '4' },
        { key: 'C', text: '5' },
        { key: 'D', text: '6' }
      ],
      correctAnswer: 'B',
      explanation: '2+2 is 4'
    },
    {
      id: 'ch1-q2',
      chapter: 'Chapter 1',
      text: 'What is the capital of France?',
      options: [
        { key: 'A', text: 'London' },
        { key: 'B', text: 'Berlin' },
        { key: 'C', text: 'Paris' },
        { key: 'D', text: 'Madrid' }
      ],
      correctAnswer: 'C',
      explanation: 'Paris is the capital of France'
    }
  ];

  beforeEach(() => {
    // Mock API calls
    cy.intercept('POST', '/api/SendCode', {
      statusCode: 200,
      body: { message: 'Code sent' }
    }).as('sendCode');

    cy.intercept('POST', '/api/VerifyCode', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Verified',
        token: 'fake-jwt-token',
        user: { id: 'test-user', phoneNumber: '+5511999999999' }
      }
    }).as('verifyCode');

    cy.intercept('GET', '/api/GetStats*', {
      statusCode: 200,
      body: []
    }).as('getStats');
    
    cy.intercept('POST', '/api/SubmitResult', {
        statusCode: 200,
        body: { message: 'Result saved' }
      }).as('submitResult');

    // Mock Courses
    cy.intercept('GET', 'assets/courses.json', {
      statusCode: 200,
      body: [
        {
          id: 'course-1',
          title: 'Test Course',
          description: 'Description',
          icon: 'test',
          dataUrl: 'assets/data/course-1.json'
        }
      ]
    }).as('getCourses');

    // Mock Questions for the course
    cy.intercept('GET', 'assets/data/course-1.json', {
      statusCode: 200,
      body: mockQuestions
    }).as('getQuestions');

    // Visit with mocked Math.random for deterministic shuffling
    cy.visit('/', {
      onBeforeLoad(win) {
        // Force Math.random to return 0.1, ensuring sort order is preserved (0.1 - 0.5 < 0)
        cy.stub(win.Math, 'random').returns(0.1);
      }
    });
  });

  it('should complete the full flow: Login -> Home -> Quiz -> Result', () => {
    // 1. Login Page
    cy.contains('Quiz Books').should('be.visible');
    
    // Interact with ngx-intl-tel-input
    // It usually puts the actual input inside a container
    cy.get('input[type="tel"]').type('11999999999'); 
    
    // Click Send Code
    cy.contains('button', 'Send Code').click();
    
    // Wait for API
    cy.wait('@sendCode');
    
    // 2. Verify Code
    cy.contains('Code sent to').should('be.visible');
    cy.get('input[placeholder="Enter 6-digit code"]').type('123456');
    cy.contains('button', 'Verify & Login').click();
    
    // Wait for API
    cy.wait('@verifyCode');
    
    // 3. Home Page - Course Selection
    cy.location('pathname').should('eq', '/');
    cy.contains('Available Courses').should('be.visible');
    cy.contains('Test Course').click();

    // 4. Chapter Selection
    // Wait for questions to load
    cy.wait('@getQuestions');
    
    // Check for chapter view elements
    // Assuming the chapter view shows "Full Practice" or chapter list
    // Note: The mock questions have "Chapter 1", so we expect to see it.
    cy.contains('Chapter 1').should('be.visible');
    
    // Click Start Chapter Quiz
    // We need to target the specific button for Chapter 1
    // The button has text "Start Chapter Quiz" or similar icon
    // Using a more generic selector to find the button associated with Chapter 1
    cy.contains('h2', 'Chapter 1').parent().find('button').click();
    
    // 5. Quiz Page
    // The quiz route is likely /quiz
    cy.url().should('include', '/quiz');
    cy.contains('Question 1 of 2').should('be.visible');

    // Handle shuffling: check which question is displayed first
    cy.get('h2').then($h2 => {
      const text = $h2.text();
      if (text.includes('2+2')) {
          // Question 1 is 2+2, Answer B (4) is correct
          cy.contains('span', '4').click();
       } else {
          // Question 1 is France, Answer C (Paris) is correct
          cy.contains('span', 'Paris').click();
       }
     });
     
     // Click Next
     cy.contains('button', 'Next').click();
     
     // Question 2
     cy.contains('Question 2 of 2').should('be.visible');
     
     // Handle shuffling: check which question is displayed second
     cy.get('h2').then($h2 => {
       const text = $h2.text();
       if (text.includes('2+2')) {
          // Question 2 is 2+2, select incorrect answer A (3)
          cy.contains('span', '3').click();
       } else {
          // Question 2 is France, select incorrect answer A (London)
          cy.contains('span', 'London').click();
       }
     });
     
     // Click Finish
     cy.contains('button', 'Finish Quiz').click();
     
     // 5. Result Page
     cy.url().should('include', '/result');
     cy.contains('Quiz Results').should('be.visible');
     
     // Check score text (relaxed check)
     cy.contains('You scored 1 out of 2').should('be.visible');
     
     // Check explanations
    cy.contains('2+2 is 4').should('be.visible'); // Explanation for Q1
    cy.contains('Paris is the capital of France').should('be.visible'); // Explanation for Q2
    
    // Check navigation back home
    cy.contains('button', 'Take Another Quiz').click();
    cy.location('pathname').should('eq', '/');
  });
});
