/**
 * @jest-environment jsdom
 */

 import { fireEvent, screen, wait, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js"
import {bills} from "../fixtures/bills.js"
import {ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import router from "../app/Router.js";


// Initiate status employe
Object.defineProperty(window, 'localStorage', {value: localStorageMock})
window.localStorage.setItem('user', JSON.stringify({type: 'Employee', email: "employee@test.tld"}))


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
    describe('When I click on icon eye', ()=>{
      test('Then the modal should be displayed', async () =>{
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);
        router();
        window.onNavigate(ROUTES_PATH.Bills);
        await waitFor(() => screen.getAllByTestId('icon-eye'))
        // Simulate function
        $.fn.modal = jest.fn();
        fireEvent.click(screen.getAllByTestId("icon-eye")[0])
        await waitFor(() => screen.getByText("Justificatif"));
        expect(screen.getByText('Justificatif')).toBeTruthy()
      })
    })
})
