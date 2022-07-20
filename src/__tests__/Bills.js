/**
 * @jest-environment jsdom
 */

import {fireEvent, screen, waitFor} from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js"
import {localStorageMock} from "../__mocks__/localStorage.js"
import Bills from "../containers/Bills.js"
import {bills} from "../fixtures/bills.js"
import {ROUTES_PATH} from "../constants/routes.js";
import router from "../app/Router.js";
import mockStore from "../__mocks__/store"


// Initiate status employe
Object.defineProperty(window, 'localStorage', {value: localStorageMock})
window.localStorage.setItem('user', JSON.stringify({type: 'Employee', email: "employee@test.tld"}))

const onNavigate = (pathname) => {
    document.body.innerHTML = ROUTES({pathname});
};


describe("Given I am connected as an employee", () => {
    describe("When I am on Bills Page", () => {
        test("Then bill icon in vertical layout should be highlighted", async () => {
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)
            router()
            window.onNavigate(ROUTES_PATH.Bills)
            await waitFor(() => screen.getByTestId('icon-window'))
            const windowIcon = screen.getByTestId('icon-window')
            // to-do write expect expression
            expect(windowIcon.classList).toContain("active-icon");
        })
        test("Then bills should be ordered from earliest to latest", () => {
            document.body.innerHTML = BillsUI({data: bills})
            const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
            const antiChrono = (a, b) => ((a < b) ? 1 : -1)
            const datesSorted = [... dates].sort(antiChrono)
            expect(datesSorted).toStrictEqual(["2004-04-04", "2003-03-03", "2002-02-02", "2001-01-01",]);
        })
    })
    // test new bill button
    describe('When I click on new Bill button', () => {
        test('Then the new bill page should be displayed', async () => {
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)
            router()
            window.onNavigate(ROUTES_PATH.Bills)
            await waitFor(() => screen.getByTestId("btn-new-bill"));
            fireEvent.click(screen.getByTestId("btn-new-bill"))
            await waitFor(() => screen.getByTestId("form-new-bill"))
            expect(screen.getByTestId('form-new-bill')).toBeTruthy()
        })
    })

    // test for modal view
    describe('When I click on icon eye', () => {
        test('Then the modal should be displayed', async () => {
            const root = document.createElement("div");
            root.setAttribute("id", "root");
            document.body.append(root);
            router();
            window.onNavigate(ROUTES_PATH.Bills);
            await waitFor(() => screen.getAllByTestId('icon-eye'))
            // Simulate function with jQuery.prototype
            $.fn.modal = jest.fn();
            fireEvent.click(screen.getAllByTestId("icon-eye")[0])
            await waitFor(() => screen.getByText("Justificatif"));
            expect(screen.getByText('Justificatif')).toBeTruthy()
        })
    })

    // Test getBills()
    describe('When  page is loaded', () => {
        test('Then getBill() should be call', async () => {
            const billsMocks = new Bills({document, onNavigate, store: mockStore, localStorage: window.localStorage})
            jest.spyOn(billsMocks, 'getBills')
            await billsMocks.getBills()
            expect(jest.spyOn(billsMocks, 'getBills')).toHaveBeenCalled()
        })
    })
})


// Integration tests
describe('Given I am connected as an employee', () => {
  describe('When I am on Bills page', () => {
    test('fetches bills from mock API GET', async () => {
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);
        router();
        window.onNavigate(ROUTES_PATH.Bills);
        await waitFor(() => screen.getByText("Mes notes de frais"))
        await waitFor(() => screen.getByText("Type"))
        await waitFor(() => screen.getByText("Nom"))
        await waitFor(() => screen.getByText("Date"))
        await waitFor(() => screen.getByText("Montant"))
        await waitFor(() => screen.getByText("Statut"))
        await waitFor(() => screen.getByText("Actions"))
  
        expect(screen.getByText("Mes notes de frais")).toBeTruthy()
        expect(screen.getByText("Type")).toBeTruthy()
        expect(screen.getByText("Nom")).toBeTruthy()
        expect(screen.getByText("Date")).toBeTruthy()
        expect(screen.getByText("Montant")).toBeTruthy()
        expect(screen.getByText("Statut")).toBeTruthy()
        expect(screen.getByText("Actions")).toBeTruthy()
    })
  })

})


