from django.shortcuts import reverse, HttpResponseRedirect

def default_view(request):
	return HttpResponseRedirect(reverse('admin:index'))
