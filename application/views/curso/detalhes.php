<br /><br />
<div class='row padding20 text-white'>
	<?php
    	echo"<div class='col-lg-10 offset-lg-1 padding0'>";
			echo"<nav aria-label='breadcrumb'>";
  				echo"<ol class='breadcrumb'>";
    				echo"<li class='breadcrumb-item'><a href='".$url."curso'>Cursos</a></li>";
    				echo "<li class='breadcrumb-item active' aria-current='page'>Detalhes</li>";
    			echo "</ol>";
			echo"</nav>";
		echo "</div>";
    ?>
	<?php
		echo "<div class='col-lg-10 offset-lg-1 background_dark'>";
			echo"<a href='javascript:window.history.go(-1)' class='link padding' title='Voltar'>";
				echo"<span class='glyphicon glyphicon-arrow-left text-white' style='font-size: 25px;'></span>";
			echo"</a>";
			echo "<br />";
			echo "<br />";
			echo "<div class='table-responsive'>";
				echo "<table class='table table-striped table-hover text-white'>";
					echo"</tr>";
					echo "<tr>";
						echo "<td>Nome</td>";
						echo "<td>".$obj['Nome_curso']."</td>";
					echo"</tr>";
					echo"<tr>";
						echo "<td>Ativo</td>";
						echo "<td>".(($obj['Ativo'] == 1) ? 'Sim' : 'Não')."</td>";
					echo "</tr>";
					echo"<tr>";
						echo "<td>Data de registro</td>";
						echo "<td>".$obj['Data_registro']."</td>";
					echo "</tr>";
				echo "</table>";
			echo "</div>";
		echo "</div>";
	?>
</div>