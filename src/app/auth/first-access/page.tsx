/**
 * TEMPORÁRIO - Página de instruções para primeiro acesso
 * Pode ser removida no futuro
 */

export default function FirstAccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo ao Portal do Cliente
          </h1>
          <p className="text-gray-600">
            Instruções para seu primeiro acesso
          </p>
        </div>

        {/* Instruções */}
        <div className="space-y-6">
          {/* Como fazer login */}
          <section className="border-l-4 border-blue-500 pl-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Como fazer login
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong className="text-blue-600">Usuário:</strong> Seu CPF (apenas números, sem pontos ou traços)
              </p>
              <p className="text-sm text-gray-500 ml-6">
                Exemplo: 12345678900
              </p>
              <p className="mt-3">
                <strong className="text-blue-600">Senha padrão:</strong> Sua data de nascimento no formato DDMMYYYY
              </p>
              <p className="text-sm text-gray-500 ml-6">
                Exemplo: Se você nasceu em 15/03/1990, sua senha é: 15031990
              </p>
            </div>
          </section>

          {/* Segurança */}
          <section className="border-l-4 border-yellow-500 pl-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Recomendações de Segurança
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Recomendamos que você altere sua senha após o primeiro acesso</li>
              <li>Nunca compartilhe suas credenciais com outras pessoas</li>
              <li>Use uma senha forte e diferente de outros serviços</li>
            </ul>
          </section>

          {/* Ajuda */}
          <section className="border-l-4 border-green-500 pl-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Precisa de ajuda?
            </h2>
            <p className="text-gray-700">
              Se você tiver problemas para acessar sua conta ou esqueceu suas credenciais, 
              entre em contato com nossa equipe de suporte.
            </p>
          </section>
        </div>

        {/* Botão de retorno */}
        <div className="mt-8 text-center">
          <a
            href="/auth/sign-in"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Fazer Login Agora
          </a>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Instituto Barros - Portal do Cliente</p>
        </div>
      </div>
    </div>
  );
}
