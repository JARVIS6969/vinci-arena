// Around line 415-418, change the Home link to:

<button 
  onClick={() => router.push('/dashboard')}
  className="text-gray-300 hover:text-white font-semibold transition cursor-pointer bg-transparent border-none"
>
  🏠 Home
</button>
