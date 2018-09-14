<?php $this->load->helper("mstring");?>
<?php $this->load->helper("faltas");?>
<br /><br />
<div class='row padding20 text-white relative' style="width: 98%; left: 2%">
	<?php
    	echo"<div class='col-lg-12 padding0'>";
			echo"<nav aria-label='breadcrumb'>";
  				echo"<ol class='breadcrumb'>";
    				echo "<li class='breadcrumb-item active' aria-current='page'>Minhas disciplinas</li>";
    			echo "</ol>";
			echo"</nav>";
		echo "</div>";
    ?>
	<input type='hidden' id='controller' value='<?php echo $controller; ?>'/>
	<input type='hidden' id='method' value='<?php echo $method; ?>'/>
	<div class='col-lg-12 padding background_dark'>
		<div class="row">
			<div class="col-lg-2 padding10" style="border-right: 1px solid white; border-bottom: 1px solid white">
				<?php
					$data['lista_disciplinas'] = $lista_disciplinas;
					$this->load->view("professor/_disciplina", $data);
				?>
			</div>
			<div class="col-lg-10" style="border-bottom: 1px solid white">
				<div class="row padding10">
					<?php
						$data['lista_bimestres'] = $lista_bimestres;
						$this->load->view("professor/_bimestre", $data);
					?>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-lg-2" style="border-right: 1px solid white">
				<div class="row padding10">
					<?php
						$data['lista_turmas'] = $lista_turmas;
						$data['url_part'] = $url_part;
						$this->load->view("professor/_turma", $data);
					?>
				</div>
			</div>
			<div class="col-lg-10">
				<div class="row padding10">
					<div class="col-lg-4">
						<a href="<?php echo $url; ?>professor/notas/<?php echo $url_part['disciplina_id']."/".$url_part['turma_id']."/".$url_part['bimestre_id']; ?>" class="btn btn-danger" style="width: 100px">Notas</a>
						<a href="<?php echo $url; ?>professor/faltas/<?php echo $url_part['disciplina_id']."/".$url_part['turma_id']."/".$url_part['bimestre_id']; ?>" class="btn btn-success" style="width: 100px; margin-left: -8px; border-radius: 0px 5px 5px 0px;">Faltas</a>
					</div>
					<div class="col-lg-8 text-right">
						<?php 
							echo "Aberto a partir de ".(!empty($bimestre['Data_abertura']) ? $bimestre['Data_abertura'] : '')." até ".(!empty($bimestre['Data_fechamento']) ? $bimestre['Data_fechamento'] : '');
						?>
					</div>
				</div>
				<div class="row padding10" style="padding-top: 0px; padding-bottom: 0px;">
					<div class="col-lg-12">
						<hr style="background-color: white">
					</div>
				</div>
				<div class="row padding10">
					<div class="col-lg-4">
						<a href="<?php echo $url; ?>professor/chamada/<?php echo $url_part['disciplina_id']."/".$url_part['turma_id']."/".$url_part['bimestre_id']; ?>" class="btn btn-primary">Fazer chamada</a>
					</div>
					<div class="col-lg-4">
						
					</div>
					<div class="col-lg-4 text-right">
						<a href="<?php echo $url; ?>professor/faltas_geral/<?php echo $url_part['disciplina_id']."/".$url_part['turma_id']."/".$url_part['bimestre_id']; ?>" class="btn btn-success" style="width: 100px">Geral</a>
						<a href="<?php echo $url; ?>professor/faltas/<?php echo $url_part['disciplina_id']."/".$url_part['turma_id']."/".$url_part['bimestre_id']; ?>" class="btn btn-danger" style="width: 100px; margin-left: -8px; border-radius: 0px 5px 5px 0px;">Detalhado</a>
					</div>
				</div>
				<div class="row padding10">
					<div class="col-lg-12">
						<table class="table table-bordered text-white">
							<thead>
								<tr>
									<td>Alunos</td>
									<?php 
										$total_col = COUNT($meses) + 1;
										$percentual = 50 / $total_col;

										for($i = 0; $i < COUNT($meses); $i ++)
										{
											echo "<td class='text-center' title='Total de faltas do mês de ".$meses[$i]['Mes']."'>";
												echo $meses[$i]['Mes'];
											echo"</td>";
										}
									?>
									<td class="text-center" title="Total de faltas no bimestre">Total</td>
								</tr>
							</thead>
							<tbody>
							<?php 
								for($i = 0; $i < COUNT($lista_alunos); $i++)
								{
									echo "<tr>";
										echo "<td class='w-50 align-middle' title='".$lista_alunos[$i]['Nome_aluno']."'>";
											echo mstring::corta_string($lista_alunos[$i]['Nome_aluno'], 30);
										echo "</td>";
										$total_faltas = 0;
										for($j = 0; $j < COUNT($meses); $j ++)
										{
											$faltas = faltas::get_faltas($url_part['disciplina_id'], $url_part['turma_id'], $lista_alunos[$i]['Matricula_id'], $meses[$j]['Mes_numero'])['Faltas']; 
											echo "<td class='text-center' style='width: ".$percentual."%;'>";
												echo "<input disabled  type='text' value='".$faltas."' class='form-control background_white border_radius text-center text-info'>";
											echo"</td>";
											$total_faltas = $total_faltas + $faltas;
										}
										echo "<td class='text-center'>";
											echo "<input disabled  type='text' value='".$total_faltas."' class='form-control background_white border_radius text-center text-info'>";
											
										echo "</td>";
									echo"</tr>";
								}
							?>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>