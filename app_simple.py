from flask import Flask, jsonify

app = Flask(__name__)

# Datos de prueba
clientes = [
    {
        "id": 1,
        "name": "Cliente 1",
        "email": "cliente1@example.com",
        "email_platform": "wildmail",
    },
    {
        "id": 2,
        "name": "Cliente 2",
        "email": "cliente2@example.com",
        "email_platform": "activecampaign",
    }
]

@app.route('/api/clients', methods=['GET'])
def get_clients():
    return jsonify(clientes)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
