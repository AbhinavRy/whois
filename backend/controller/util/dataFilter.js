exports.defaultReg = {
    whoisData: /([^\n\r:]*)(:[ \t])[ \t]*([^\n\r]*)/gm,
    splitStr: ": ",
    fieldNames: [
        {
            field: "domainName",
            regex: /domainname/i,
            renamedAs: "domain",
        },
        {
            field: "updatedDate",
            regex: /(updat.*date|lastModified)/i,
            renamedAs: "updated_date",
        },
        {
            field: "createdDate",
            regex: /(^regist.*(Date|On)|^creat.*(Date|On))/g,
            renamedAs: "created_date",
        },
        {
            field: "registrarRegistrationExpirationDate",
            regex: /(.*regist.*expir.*date$|^expir.*date)/gi,
            renamedAs: "expiration_date",
        },
        {
            field: "registrar",
            regex: /(^registrar$|^registrar.*name$|^registrant$)/i,
            renamedAs: "registrar",
        },
        {
            field: "registrantCountry",
            regex: /(registrantcountry|registra.*country)/i,
            renamedAs: "reg_country",
        },
    ],
}

exports.dataFilterReg = [
    {
        tld: 'jp',
        whoisData: /(\[(.*?)\])([ \t])[ \t]*([^\n\r]*)/gm,
        splitStr: "] ",
        fieldNames: [
            {
                field: "domainName",
                renamedAs: "domain",
            },
            {
                field: "lastUpdated",
                renamedAs: "updated_date",
            },
            {
                field: "createdOn",
                renamedAs: "created_date",
            },
            {
                field: "expiresOn",
                renamedAs: "expiration_date",
            },
            {
                field: "registrant",
                renamedAs: "registrar",
            },
            {
                field: "registrantCountry",
                renamedAs: "reg_country",
            },
        ],
    },
]