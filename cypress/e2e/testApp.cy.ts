describe('testApp', () => {
    it('tests the application features', () => {
        cy.viewport(1573, 1024)
        cy.visit('/')
        cy.get('#responsive-navbar-nav > div:nth-of-type(1)').click()
        cy.get('div.mr-5 > div').click()
        cy.get('#email').type('test@tessst.fr')
        cy.get('#password').type('Racistedunet1!')
        cy.get('nav div:nth-of-type(3)').click()
        cy.get('img').click()
        cy.get('div.justifiy-content-center button').click()
        cy.get('#email').type('test@test.com')
        cy.get('#password').dblclick()
        cy.get('#password').click()
        cy.get('#password').type('Validpassword123!')
        cy.get('#root > div button').click()
        cy.get('div.justifiy-content-center button').click()
        cy.get('form > div:nth-of-type(1) button').click()
        cy.get('div.css-qbdosj-Input').click()
        cy.get('#react-select-3-option-0').click()
        cy.get('button.my-3').click()
        cy.get('button:nth-of-type(2)').click()
        cy.get('html').click()
        cy.get('input').click()
        cy.get('input').type('test')
        cy.get('div.d-flex button').click()
        cy.get('img').click()
        cy.get('nav > div.nav-item > div').click()
    })
})
//# recorderSourceMap=BCBDBEBFBGBHBIBJBKBLBMBNBOBPBQBRBSBTBUBVBWBXBYBZBaBbBcAcBdBeBfBgBBhBBiBBjBBkBBlBBmBBnBBoBBpBB
