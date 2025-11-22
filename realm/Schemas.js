export const Logging = {
    name: 'Logging',
    primaryKey: 'id',
    properties: {
      id: 'string',
      nrpl: { type: "string", indexed: true },
      createdAt: 'date',
      chassisnr: 'string?',
      kmstand: 'int?',
      merk: 'string?',
      model: 'string?',
      kleur: 'string?',
      bouwjaar: 'string?',
      prestatie1: 'string?',
      prestatie2: 'string?',
      prestatie3: 'string?',
      opmerking: 'string?',
    },

}