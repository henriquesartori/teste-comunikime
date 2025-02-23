import { processCustomerCsvSchema } from "../../src/validators/customer.validator";

describe('Customer Validator', () => {
    it('deve validar e transformar dados válidos', () => {
        const input = {
            id: "2a1bb061-c2b2-479d-890a-b33ed075b390",
            name: " Dr. John Doe ",
            birthDate: "2024-08-05",
            gender: "male",
            email: "JOHN.DOE@example.com",
            phone: "123.456.7890 x1234",
            address: " 123 Main St ",
            city: "City",
            state: "State"
        };

        const result = processCustomerCsvSchema.safeParse(input);
        expect(result.success).toBe(true); // verifica se passou na validação

        if (result.success) {
            expect(result.data.name).toBe("Dr. John Doe"); // verifica o trim
            expect(result.data.email).toBe("john.doe@example.com"); // verifica o lowercase
            expect(result.data.phone).toBe("1234567890x1234"); // verifica o regex
            expect(result.data.birthDate).toBeInstanceOf(Date); // verifica a transformação em date
        }
    });

    it('deve falhar se os dados estiverem inválidos', () => {
        const input = {
            id: "a",
            name: "",
            birthDate: "a",
            gender: "a",
            email: "a",
            phone: "a",
            address: "",
            city: "",
            state: ""
        };

        const result = processCustomerCsvSchema.safeParse(input);
        expect(result.success).toBe(false); // verifica se falhou na validação

        if (!result.success) {
            expect(result.error.issues).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ path: ["id"], message: expect.any(String) }), // verifica se o id nao é um uuid
                    expect.objectContaining({ path: ["birthDate"], message: expect.any(String) }), // verifica se birthDate nao pode transformado em data
                    expect.objectContaining({ path: ["gender"], message: expect.any(String) }), // verifica se gender nao é male ou female
                    expect.objectContaining({ path: ["email"], message: expect.any(String) }), // verifica se nao é um email válido
                ])
            );
        }
    });
});
