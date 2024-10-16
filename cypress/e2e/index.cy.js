it('titles are correct', () => {
    const page = cy.visit('/');

    page.get('title').should('have.text', 'Alejandro Acosta - Backend Developer');
    page.get('h1').should('have.text', 'Alejandro Acosta');
});

it('has used stack', () => {
    const page = cy.visit('/');

    // Should have al least one stack
    page.get('#used-stack').should('have.length.gte', 1);
})

it('has projects', () => {
    const page = cy.visit('/');

    // Should have al least one project
    page.get('article').should('have.length.gte', 1);
})

it('has experiences', () => {
    const page = cy.visit('/');

    // Should have al least one experience
    page.get('#experiences-list .experience-list-item').should('have.length', 2);
})

it('has social networks', () => {
    const page = cy.visit('/');

    // Should have al least one social network
    page.get('.social-networks').should('have.length.gte', 1);
})

it('show mobile menu', () => {
    const page = cy.viewport('samsung-s10').visit('/');

    page.get('#desktop-nav').should('not.be.visible');
    page.get('#open-menu').should('be.visible');
});

it('can toggle mobile menu', () => {
    const page = cy.viewport('samsung-s10').visit('/');

    page.get('#open-menu').click();
    page.get('#mobile-menu').should('be.visible');
    page.get('#close-menu').click();
    page.get('#mobile-menu').should('not.be.visible');
});

it('on open mobile menu cant do vertical scrolling', () => {
    const page = cy.viewport('samsung-s10').visit('/');

    page.get('#open-menu').click();
    page.get('#mobile-menu').should('be.visible');
    page.get('body').should('have.css', 'overflow', 'hidden');
    page.get('#close-menu').click();
});

it('initialize with default theme', () => {
    const page = cy.visit('/');

    page.getAllLocalStorage().then(storage => {
        const local = storage[Cypress.config().baseUrl] ?? false;

        if (local) {
            expect(local).to.have.property('theme');
        }
    })
})

it('can toggle theme', () => {
    const page = cy.viewport('macbook-13').visit('/');

    page.get('#desktop-theme-switcher').click();
    page.get('body').should('satisfy', (dom) => {
        const classes = Array.from(dom[0].classList);
        return !classes.includes('dark');
    })

    page.get('#desktop-theme-switcher').click();

    page.get('body').should('satisfy', (dom) => {
        const classes = Array.from(dom[0].classList);
        return classes.includes('dark');
    })
});


it('can toggle theme on mobile', () => {
    const page = cy.viewport('samsung-s10').visit('/');

    page.get('#open-menu').click();
    page.get('#mobile-theme-switcher').click();

    page.get('body').should('satisfy', (dom) => {
        const classes = Array.from(dom[0].classList);
        return !classes.includes('dark');
    })

    page.get('#mobile-theme-switcher').click();

    page.get('body').should('satisfy', (dom) => {
        const classes = Array.from(dom[0].classList);
        return classes.includes('dark');
    })

    page.get('#close-menu').click();
});