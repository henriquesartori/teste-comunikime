import { z } from "zod";

export const processCustomerSchema = z.object({
    files: z
        .array(z.custom<Express.Multer.File>())
        .min(1, 'Nenhum arquivo enviado.')
        .max(1, 'Apenas um arquivo é permitido por requisição.')
        .refine(v => (v.length !== 1 || v[0].mimetype === 'text/csv'), { message: 'Apenas arquivos .csv são suportados.' })
})

export const processCustomerCsvSchema = z.object({
    id: z.string().trim().uuid('Não é um UUID válido'),
    name: z.string().trim(),

    birthDate: z
        .string({ message: 'Não é uma string' })
        .trim()
        .transform(v => new Date(v))
        .refine(v => !isNaN(v.getTime()), { message: 'Data inválida.' }),

    gender: z
        .string()
        .trim()
        .toLowerCase()
        .refine(v => v === 'male' || v === 'female', { message: 'Gênero inválido.' }),

    email: z
        .string()
        .trim()
        .toLowerCase()
        .email('E-mail inválido'),

    phone: z
        .string()
        .transform(v => v.replace(/[\s\-.()]/g, '')),

    address: z.string().trim(),
    city: z.string().trim(),
    state: z.string().trim()

}).transform(({ id, ...rest }) => ({
    uuid: id,
    ...rest
}));