export const appData = {
    people: [
        {
            id: crypto.randomUUID(),
            name: "layan",
            relationship: "friend",
            description: "y2k, wolfcut",
            imageId: 0
        },
        {
            id: crypto.randomUUID(),
            name: "miriam",
            relationship: "friend",
            description: "curly hair, casual",
            imageId: 1
        },
        {
            id: crypto.randomUUID(),
            name: "layan",
            relationship: "friend",
            description: "y2k, wolfcut",
            imageId: 0
        },
        {
            id: crypto.randomUUID(),
            name: "miriam",
            relationship: "friend",
            description: "curly hair, casual",
            imageId: 1
        }
    ],
    diaries: [
    {
        id: crypto.randomUUID(),
        title: "Little Life",
        coverId: 3,
        entries: [
            {
                id: crypto.randomUUID(),
                name: "First Day",
                created_at: "13 July 2026",
                content: {
                    "type": "doc",
                    "content": [
                        {
                            "type": "paragraph",
                            "attrs": {
                                "textAlign": null
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Start writing about your day..."
                                }
                            ]
                        },
                        {
                            "type": "image",
                            "attrs": {
                                "src": "/src/assets/tiptap-writing-space/dear-diary-generating.gif",
                                "alt": "tart writing about your day...",
                                "title": null,
                                "width": null,
                                "height": null
                            }
                        },
                        {
                            "type": "paragraph",
                            "attrs": {
                                "textAlign": null
                            }
                        }
                    ]
                }
            },
            {
                id: crypto.randomUUID(),
                name: "Second Day",
                created_at: "14 July 2026",
                content: {
                    "type": "doc",
                    "content": [
                        {
                            "type": "paragraph",
                            "attrs": {
                                "textAlign": null
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "text": "This is the 2nd entry"
                                }
                            ]
                        },
                        {
                            "type": "image",
                            "attrs": {
                                "src": "/src/assets/tiptap-writing-space/dear-diary-generating.gif",
                                "alt": "tart writing about your day...",
                                "title": null,
                                "width": null,
                                "height": null
                            }
                        },
                        {
                            "type": "paragraph",
                            "attrs": {
                                "textAlign": null
                            }
                        }
                    ]
                }
            }
        ] 
    }
]
}